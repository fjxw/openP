using OpenP.Enums;

namespace OpenP.DTOs.Product;

public record CreateProductRequest
{
    public string Name { get; init; }
    public string Description { get; init; }
    public decimal Price { get; init; }
    public int Quantity { get; set; }
    public string Category { get; set; }
}