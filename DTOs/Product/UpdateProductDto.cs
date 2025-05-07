using OpenP.Enums;

namespace OpenP.DTOs.Product;

public record UpdateProductDto
{
    public string? Name { get; init; }
    public string? Description { get; init; }
    public decimal? Price { get; init; }
    public int? Quantity { get; init; }
    public string? Category { get; init; }
}