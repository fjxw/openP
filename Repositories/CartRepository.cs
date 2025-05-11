using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OpenP.Data;
using OpenP.Entities;

namespace OpenP.Repositories
{
    public class CartRepository(ApplicationDbContext context) : ICartRepository
    {
        public async Task<Cart?> GetCartByUserIdAsync(int userId)
        {
            var user = await context.Users.FindAsync(userId);
            if (user == null) throw new InvalidOperationException("Пользователь не найден");
            return await context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.CartId == user.CartId);
        }

        public async Task AddItemToCartAsync(int userId, CartItem item)
        {
            var product = await context.Products.FindAsync(item.ProductId);
            if (product == null)
                throw new InvalidOperationException("Товар не найден");
            if (product.Quantity < item.Quantity)
                throw new InvalidOperationException("Недостаточно товара на складе");
            var cart = await GetCartByUserIdAsync(userId);
            var existingItem = cart?.CartItems.FirstOrDefault(ci => ci.ProductId == item.ProductId);
            if (existingItem != null)
            {
                if (product.Quantity < existingItem.Quantity + item.Quantity)
                    throw new InvalidOperationException("Недостаточно товара на складе");
                existingItem.Quantity += item.Quantity;
                context.CartItems.Update(existingItem);
            }
            else
            {
                item.CartId = cart.CartId;
                item.Product = product;
                context.CartItems.Add(item);
            }
            await context.SaveChangesAsync();
        }

        public async Task UpdateCartItemQuantityAsync(int userId, int productId, int quantity)
        {
            if (quantity <= 0)
            {
                await RemoveItemFromCartAsync(userId, productId);
                return;
            }
            var product = await context.Products.FindAsync(productId);
            if (product == null)
                throw new InvalidOperationException("Товар не найден");
            if (product.Quantity < quantity)
                throw new InvalidOperationException("Недостаточно товара на складе");
            var cart = await GetCartByUserIdAsync(userId);
            
            
            if (cart == null)
                throw new InvalidOperationException("Корзина не найдена");
                
            var cartItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == productId);
            if (cartItem != null)
            {
                cartItem.Quantity = quantity;
                context.CartItems.Update(cartItem);
                await context.SaveChangesAsync();
            }
            else
            {
        
                var item = new CartItem 
                { 
                    CartId = cart.CartId, 
                    ProductId = productId, 
                    Quantity = quantity 
                };
                context.CartItems.Add(item);
                await context.SaveChangesAsync();
            }
        }

        public async Task RemoveItemFromCartAsync(int userId, int productId)
        {
            var cart = await GetCartByUserIdAsync(userId);
            var cartItem = cart?.CartItems.FirstOrDefault(ci => ci.ProductId == productId);
            if (cartItem != null)
            {
                context.CartItems.Remove(cartItem);
                await context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<CartItem>> GetCartItemsAsync(int userId)
        {
            var cart = await GetCartByUserIdAsync(userId);
            return cart?.CartItems ?? Enumerable.Empty<CartItem>();
        }

        public async Task<decimal> GetCartTotalAsync(int userId)
        {
            var cartItems = await GetCartItemsAsync(userId);
            return cartItems.Sum(item => item.Product.Price * item.Quantity);
        }

        public async Task ClearCartAsync(int userId)
        {
            var cart = await GetCartByUserIdAsync(userId);
            context.CartItems.RemoveRange(cart.CartItems);
            await context.SaveChangesAsync();
        }
        
        public async Task<bool> IsProductAvailableAsync(int productId, int requestedQuantity)
        {
            var product = await context.Products.FindAsync(productId);
            return product != null && product.Quantity >= requestedQuantity;
        }
    }
}