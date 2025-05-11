using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenP.DTOs.Cart;
using OpenP.Entities;
using OpenP.Repositories;
using System.Security.Claims;
using OpenP.Data;

namespace OpenP.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CartController(ICartRepository cartRepository, ApplicationDbContext context) : ControllerBase
    {
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("Пользователь не авторизован");
            return int.Parse(userIdClaim.Value);
        }

        [HttpGet]
        public async Task<ActionResult<CartDto>> GetCart()
        {
            int userId = GetCurrentUserId();
            var cart = await cartRepository.GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                try
                {
                    cart = new Cart { UserId = userId };
                    context.Carts.Add(cart);
                    await context.SaveChangesAsync();
                }
                catch (Exception)
                {
                    
                    cart = await cartRepository.GetCartByUserIdAsync(userId);
                    
                    if (cart == null)
                    {
                        return StatusCode(500, new { message = "Failed to create or retrieve cart" });
                    }
                }
            }

            decimal totalPrice = await cartRepository.GetCartTotalAsync(userId);

            var cartDto = new CartDto
            {
                CartId = cart.CartId,
                UserId = userId,
                Items = cart.CartItems.Select(ci => new CartItemDto
                {
                    ProductId = ci.ProductId,
                    Quantity = ci.Quantity
                }).ToList(),
                TotalPrice = totalPrice 
            };
            return Ok(cartDto);
        }

        [HttpGet("items")]
        public async Task<ActionResult<IEnumerable<CartItemDto>>> GetCartItems()
        {
            int userId = GetCurrentUserId();
            var items = await cartRepository.GetCartItemsAsync(userId);
            var result = items.Select(ci => new CartItemDto
            {
                ProductId = ci.ProductId,
                Quantity = ci.Quantity
            });
            return Ok(result);
        }

        [HttpPost("items")]
        public async Task<IActionResult> AddItemToCart([FromBody] CartItemDto itemDto)
        {
            int userId = GetCurrentUserId();
            var isAvailable = await cartRepository.IsProductAvailableAsync(itemDto.ProductId, itemDto.Quantity);
            if (!isAvailable)
                return BadRequest(new { message = "Недостаточно товара на складе" });

            var item = new CartItem
            {
                ProductId = itemDto.ProductId,
                Quantity = itemDto.Quantity
            };
            await cartRepository.AddItemToCartAsync(userId, item);
            return Ok();
        }

        [HttpPut("items/{productId}")]
        public async Task<IActionResult> UpdateCartItemQuantity(int productId, [FromBody] int quantity)
        {
            int userId = GetCurrentUserId();
            var isAvailable = await cartRepository.IsProductAvailableAsync(productId, quantity);
            if (!isAvailable)
                return BadRequest(new { message = "Недостаточно товара на складе" });

            await cartRepository.UpdateCartItemQuantityAsync(userId, productId, quantity);
            
            var cart = await cartRepository.GetCartByUserIdAsync(userId);
            var cartDto = new CartDto
            {
                CartId = cart.CartId,
                UserId = userId,
                Items = cart.CartItems.Select(ci => new CartItemDto
                {
                    ProductId = ci.ProductId,
                    Quantity = ci.Quantity
                }).ToList()
                
            };
            
            return Ok(cartDto);
        }

        [HttpDelete("items/{productId}")]
        public async Task<IActionResult> RemoveItemFromCart(int productId)
        {
            int userId = GetCurrentUserId();
            await cartRepository.RemoveItemFromCartAsync(userId, productId);
            return NoContent();
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            int userId = GetCurrentUserId();
            await cartRepository.ClearCartAsync(userId);
            return NoContent();
        }
        
        [HttpGet("total")]
        public async Task<ActionResult<decimal>> GetCartTotal()
        {
            int userId = GetCurrentUserId();
            var total = await cartRepository.GetCartTotalAsync(userId);
            return Ok(new { total });
        }
    }
}
