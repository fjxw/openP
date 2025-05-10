using Microsoft.EntityFrameworkCore;
using OpenP.Data;
using OpenP.Entities;
using OpenP.Enums;

namespace OpenP.Repositories
{
    public class ProductRepository(ApplicationDbContext context) : IProductRepository
    {
        public async Task<Product?> GetProductByIdAsync(int productId)
        {
            return await context.Products.FindAsync(productId);
        }
        
        public async Task<Product?> GetProductByNameAsync(string name)
        {
            return await context.Products.FirstOrDefaultAsync(p => p.Name == name);
        }

        public async Task<IEnumerable<Product?>> GetAllProductsAsync(int pageNumber, int pageSize)
        {
            return await context.Products
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> GetTotalProductsCountAsync()
        {
            return await context.Products.CountAsync();
        }

        public async Task AddProductAsync(Product? product)
        {
            await context.Products.AddAsync(product);
            await context.SaveChangesAsync();
        }

        public async Task UpdateProductAsync(Product? product)
        {
            context.Products.Update(product);
            await context.SaveChangesAsync();
        }

        public async Task DeleteProductAsync(int productId)
        {
            var product = await GetProductByIdAsync(productId);
            context.Products.Remove(product);
            await context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Product?>> GetProductsByCategoryAsync(Categories category, int pageNumber,
            int pageSize)
        {
            return await context.Products
                .Where(p => p.Category.ToString() == category.ToString())
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product?>> GetProductsByNameAsync(string name, int pageNumber, int pageSize)
        {
            var searchTerm = name?.ToLower() ?? string.Empty;
            return await context.Products
                .Where(p => EF.Functions.Like(p.Name.ToLower(), $"%{searchTerm}%") ||
                           EF.Functions.Like(p.Description.ToLower(), $"%{searchTerm}%"))
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product?>> GetProductsByPriceRangeAsync(decimal minPrice, decimal maxPrice,
            int pageNumber, int pageSize, Categories? category = null)
        {
            var query = context.Products
                .Where(p => p.Price >= minPrice && p.Price <= maxPrice);
                
            if (category != null)
            {
                query = query.Where(p => p.Category == category);
            }
            
            return await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }
    }
}