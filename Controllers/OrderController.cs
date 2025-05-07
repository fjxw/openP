using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using OpenP.DTOs.Order;
using OpenP.Entities;
using OpenP.Enums;
using OpenP.Repositories;
using OpenP.Data;
using System.Security.Claims;

namespace OpenP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrderController(
        IOrderRepository orderRepository,
        IProductRepository productRepository,
        ICartRepository cartRepository,
        IUserRepository userRepository,
        ApplicationDbContext context)
        : ControllerBase
    {
        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null) throw new UnauthorizedAccessException("Пользователь не авторизован");
            return int.Parse(claim.Value);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders()
        {
            var userId = GetUserId();
            var orders = await orderRepository.GetOrdersByUserIdAsync(userId);
            var result = orders.Select(o => new OrderDto {
                OrderId = o.OrderId,
                UserId = o.UserId,
                OrderDate = o.OrderDate,
                Status = o.Status.ToString(),
                Address = o.Address,
                PhoneNumber = o.PhoneNumber,
                OrderItems = o.OrderItems.Select(i => new OrderItemDto {
                    ProductId = i.ProductId,
                    Price = i.Price,
                    Quantity = i.Quantity
                }).ToList(),
                TotalAmount = o.OrderItems.Sum(i => i.Price * i.Quantity)
            });
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            var userId = GetUserId();
            var o = await orderRepository.GetOrderByIdAsync(id);
            if (o == null || o.UserId != userId) return NotFound("Заказ не найден");
            var dto = new OrderDto {
                OrderId = o.OrderId,
                UserId = o.UserId,
                OrderDate = o.OrderDate,
                Status = o.Status.ToString(),
                Address = o.Address,
                PhoneNumber = o.PhoneNumber,
                OrderItems = o.OrderItems.Select(i => new OrderItemDto {
                    ProductId = i.ProductId,
                    Price = i.Price,
                    Quantity = i.Quantity
                }).ToList(),
                TotalAmount = o.OrderItems.Sum(i => i.Price * i.Quantity)
            };
            return Ok(dto);
        }

        [HttpPost]
        public async Task<ActionResult<OrderDto>> CreateOrder([FromBody] CreateOrderDto dto)
        {
            var userId = GetUserId();
            
            // Check if user exists before creating an order
            var user = await userRepository.GetUserByIdAsync(userId);
            if (user == null)
                return NotFound(new { message = "Пользователь не найден" });
                
            await using var transaction = await context.Database.BeginTransactionAsync();
            try
            {
                var items = new List<OrderItem>();
                if (dto.Items != null && dto.Items.Any())
                {
                    foreach (var it in dto.Items)
                    {
                        var product = await productRepository.GetProductByIdAsync(it.ProductId);
                        if (product == null)
                            return NotFound($"Товар с ID {it.ProductId} не найден");
                        if (product.Quantity < it.Quantity)
                            return BadRequest($"Недостаточно товара '{product.Name}' на складе");
                        product.Quantity -= it.Quantity;
                        await productRepository.UpdateProductAsync(product);
                        items.Add(new OrderItem {
                            ProductId = product.ProductId,
                            Price = product.Price,
                            Quantity = it.Quantity
                        });
                    }
                }
                else
                {
                    return BadRequest("Невозможно создать пустой заказ");
                }

                var order = new Order {
                    UserId = userId,
                    OrderDate = DateTime.UtcNow,
                    Status = Statuses.Created,
                    Address = dto.Address,
                    PhoneNumber = dto.Phone,
                    OrderItems = items
                };
                await orderRepository.CreateOrderAsync(order);
                await transaction.CommitAsync();

                var result = new OrderDto {
                    OrderId = order.OrderId,
                    UserId = order.UserId,
                    OrderDate = order.OrderDate,
                    Status = order.Status.ToString(),
                    Address = order.Address,
                    PhoneNumber = order.PhoneNumber,
                    OrderItems = items.Select(i => new OrderItemDto {
                        ProductId = i.ProductId,
                        Price = i.Price,
                        Quantity = i.Quantity
                    }).ToList(),
                    TotalAmount = items.Sum(i => i.Price * i.Quantity)
                };
                return CreatedAtAction(nameof(GetOrder), new { id = order.OrderId }, result);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("from-cart")]
        public async Task<ActionResult<OrderDto>> CreateOrderFromCart([FromBody] CreateOrderByCartDto dto)
        {
            var userId = GetUserId();
            
            // Check if user exists before creating an order
            var user = await userRepository.GetUserByIdAsync(userId);
            if (user == null)
                return NotFound(new { message = "Пользователь не найден" });
                
            await using var transaction = await context.Database.BeginTransactionAsync();
            try
            {
                var cartItems = await cartRepository.GetCartItemsAsync(userId);
                if (!cartItems.Any())
                    return BadRequest("Корзина пуста");
                var items = new List<OrderItem>();
                foreach (var ci in cartItems)
                {
                    var product = ci.Product ?? await productRepository.GetProductByIdAsync(ci.ProductId);
                    if (product == null)
                        return NotFound($"Товар с ID {ci.ProductId} не найден");
                    if (product.Quantity < ci.Quantity)
                        return BadRequest($"Недостаточно товара '{product.Name}'");
                    product.Quantity -= ci.Quantity;
                    await productRepository.UpdateProductAsync(product);
                    items.Add(new OrderItem {
                        ProductId = product.ProductId,
                        Price = product.Price,
                        Quantity = ci.Quantity
                    });
                }
                var order = new Order {
                    UserId = userId,
                    OrderDate = DateTime.UtcNow,
                    Status = Statuses.Created,
                    Address = dto.Address,
                    PhoneNumber = dto.Phone,
                    OrderItems = items
                };
                await orderRepository.CreateOrderAsync(order);
                await cartRepository.ClearCartAsync(userId);
                await transaction.CommitAsync();

                var result = new OrderDto {
                    OrderId = order.OrderId,
                    UserId = order.UserId,
                    OrderDate = order.OrderDate,
                    Status = order.Status.ToString(),
                    Address = order.Address,
                    PhoneNumber = order.PhoneNumber,
                    OrderItems = items.Select(i => new OrderItemDto {
                        ProductId = i.ProductId,
                        Price = i.Price,
                        Quantity = i.Quantity
                    }).ToList(),
                    TotalAmount = items.Sum(i => i.Price * i.Quantity)
                };
                return CreatedAtAction(nameof(GetOrder), new { id = order.OrderId }, result);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] UpdateOrderDto dto)
        {
            var userId = GetUserId();
            var order = await orderRepository.GetOrderByIdAsync(id);
            if (order == null || order.UserId != userId) return NotFound(new { message = "Заказ не найден"});
            if (dto.PhoneNumber != null)
                order.PhoneNumber = dto.PhoneNumber;
            if (dto.Address != null)
                order.Address = dto.Address;
            if (dto.Status != null)
            {
                if (!Enum.TryParse<Statuses>(dto.Status, true, out var status))
            {
                return BadRequest(new { message = "Недопустимый статус заказа" });
            }
            var newStatus = status;
            var oldStatus = order.Status;
            order.Status = newStatus;
            if (newStatus == Statuses.Cancelled)
            {
                foreach (var it in order.OrderItems)
                {
                    var p = await productRepository.GetProductByIdAsync(it.ProductId);
                    if (p != null)
                    {
                        p.Quantity += it.Quantity;
                        await productRepository.UpdateProductAsync(p);
                    }
                }
            }
             if (newStatus == Statuses.Completed || newStatus == Statuses.Cancelled)
            {
                return BadRequest(new { message = "Заказ уже завершен" });
            }
            }
            
            await orderRepository.UpdateOrderAsync(order);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var userId = GetUserId();
            var order = await orderRepository.GetOrderByIdAsync(id);
            if (order == null || order.UserId != userId) return NotFound(new { message = "Заказ не найден" });
            if (order.Status != Statuses.Completed && order.Status != Statuses.Cancelled)
            {
                foreach (var it in order.OrderItems)
                {
                    var p = await productRepository.GetProductByIdAsync(it.ProductId);
                    if (p != null)
                    {
                        p.Quantity += it.Quantity;
                        await productRepository.UpdateProductAsync(p);
                    }
                }
            }
            await orderRepository.DeleteOrderAsync(id);
            return NoContent();
        }
    }
}
