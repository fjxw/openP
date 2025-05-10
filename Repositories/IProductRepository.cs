using OpenP.Enums;

namespace OpenP.Repositories;

using OpenP.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IProductRepository
{
    Task<IEnumerable<Product?>> GetAllProductsAsync(int pageNumber, int pageSize);
    Task<Product?> GetProductByIdAsync(int productId);
    Task AddProductAsync(Product? product);
    Task<IEnumerable<Product?>> GetProductsByCategoryAsync(Categories category, int pageNumber, int pageSize);
    Task<IEnumerable<Product?>> GetProductsByNameAsync(string name, int pageNumber, int pageSize);
    Task<int> GetTotalProductsCountAsync();
    Task UpdateProductAsync(Product? product);
    Task<Product?> GetProductByNameAsync(string name);
    Task DeleteProductAsync(int productId);
    Task<IEnumerable<Product?>> GetProductsByPriceRangeAsync(decimal minPrice, decimal maxPrice, int pageNumber, int pageSize, Categories? category = null);
}