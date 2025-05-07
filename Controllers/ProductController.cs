using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenP.DTOs.Product;
using OpenP.Entities;
using OpenP.Repositories;
using OpenP.Services;
using System.Globalization;
using OpenP.Enums;

namespace OpenP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController(IProductRepository productRepository, FileService fileService)
        : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts(int pageNumber = 1, int pageSize = 10)
        {
            var products = await productRepository.GetAllProductsAsync(pageNumber, pageSize);
            var dtos = products.Select(product => new ProductDto
            {
                ProductId = product.ProductId,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Quantity = product.Quantity,
                Category = product.Category.ToString()
            });
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await productRepository.GetProductByIdAsync(id);
            if (product == null)
                return NotFound(new { message = "Товар не найден" });
            return Ok(new ProductDto
            {
                ProductId = product.ProductId,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Quantity = product.Quantity,
                Category = product.Category.ToString()
            });
        }

        [HttpGet("{id}/image")]
        public async Task<ActionResult> GetProductImageById(int id)
        {
            try
            {
                var data = fileService.GetFile("Products", id.ToString());
                return File(data, "image/jpeg", $"IMG-{id}");
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProductsByName(string name, int pageNumber = 1, int pageSize = 10)
        {
            var products = await productRepository.GetProductsByNameAsync(name, pageNumber, pageSize);
            var dtos = products.Select(product => new ProductDto
            {
                ProductId = product.ProductId,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Quantity = product.Quantity,
                Category = product.Category.ToString()
            });
            return Ok(dtos);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateProductRequest request)
        {
            if (!Enum.TryParse<Categories>(request.Category, true, out var category))
                return BadRequest(new { message = $"Неверная категория: {request.Category}" });

            var product = new Product
            {
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                Quantity = request.Quantity,
                Category = category,
            };

            await productRepository.AddProductAsync(product);
            return CreatedAtAction(nameof(GetProduct), new { id = product.ProductId }, product);
        }

        [HttpPost("{id}/image")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddProductImage(int id, IFormFile file)
        {
            await fileService.SaveFile(file, "Products", id.ToString());
            return Ok();
        }

        [HttpPatch("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateProductDto dto)
        {
            var product = await productRepository.GetProductByIdAsync(id);
            if (product == null)
                return NotFound(new { message = "Товар не найден" });
            if (dto.Name != null)
                product.Name = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(dto.Name);
            if (dto.Description != null)
                product.Description = dto.Description;
            if (dto.Price.HasValue)
                product.Price = dto.Price.Value;
            if (dto.Quantity.HasValue)
                product.Quantity = dto.Quantity.Value;
            if (!Enum.TryParse<Categories>(dto.Category, true, out var category))
                return BadRequest(new { message = $"Неверная категория: {dto.Category}" });
            product.Category = category;
            await productRepository.UpdateProductAsync(product);
            return NoContent();
        }
        
        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProductsByCategory(string category, int pageNumber = 1, int pageSize = 10)
        {
            if (!Enum.TryParse<Categories>(category, true, out var cat))
                return BadRequest(new { message = $"Неверная категория: {category}" });

            var products = await productRepository.GetProductsByCategoryAsync(cat, pageNumber, pageSize);
            var dtos = products.Select(product => new ProductDto
            {
                ProductId = product.ProductId,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Quantity = product.Quantity,
                Category = product.Category.ToString()
            });
            return Ok(dtos);
        }
        
        [HttpGet("price")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProductsByPriceRange(decimal minPrice, decimal maxPrice, int pageNumber = 1, int pageSize = 10)
        {
            var products = await productRepository.GetProductsByPriceRangeAsync(minPrice, maxPrice, pageNumber, pageSize);
            var dtos = products.Select(product => new ProductDto
            {
                ProductId = product.ProductId,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Quantity = product.Quantity,
                Category = product.Category.ToString()
            });
            return Ok(dtos);
        }

        [HttpGet("categories")]
        public ActionResult<IEnumerable<string>> GetCategories()
        {
            var categories = Enum.GetValues(typeof(Categories))
                .Cast<Categories>()
                .Select(c => c.ToString())
                .ToArray();

            return Ok(categories);
        }
        
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                await productRepository.DeleteProductAsync(id);
                return NoContent();
            }
            catch
            {
                return NotFound(new { message = "Товар не найден" });
            }
        }
    }
}
