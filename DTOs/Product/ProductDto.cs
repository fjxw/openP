namespace OpenP.DTOs.Product
{
    public record ProductDto
    {
        public int ProductId { get; init; }
        public string Name { get; init; }
        public string Description { get; init; }
        public decimal Price { get; init; }
        public int Quantity { get; init; }
        public string Category { get; init; }
    }
}