namespace OpenP.Repositories;

using OpenP.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IOrderRepository
{
    Task<Order?> GetOrderByIdAsync(int orderId);
    Task<IEnumerable<Order>> GetOrdersByUserIdAsync(int userId);
    Task<IEnumerable<Order>> GetAllOrdersAsync();
    Task CreateOrderAsync(Order order);
    Task UpdateOrderAsync(Order? order);
    Task DeleteOrderAsync(int orderId);
}