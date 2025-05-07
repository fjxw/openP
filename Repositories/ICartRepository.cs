namespace OpenP.Repositories;

using OpenP.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface ICartRepository
{
    Task<Cart?> GetCartByUserIdAsync(int userId);
    Task AddItemToCartAsync(int userId, CartItem item);
    Task UpdateCartItemQuantityAsync(int userId, int productId, int quantity);
    Task RemoveItemFromCartAsync(int userId, int productId);
    Task<IEnumerable<CartItem>> GetCartItemsAsync(int userId);
    Task<decimal> GetCartTotalAsync(int userId);
    Task<bool> IsProductAvailableAsync(int productId, int requestedQuantity);
    Task ClearCartAsync(int userId);
}