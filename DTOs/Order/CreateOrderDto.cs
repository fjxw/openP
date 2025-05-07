namespace OpenP.DTOs.Order
{
    public record CreateOrderDto
    {
        public List<OrderItemCreateDto> Items { get; init; } = [];
        public string Address { get; init; }
        public string Phone { get; init; }
    }

    public record OrderItemCreateDto
    {
        public int ProductId { get; init; }
        public int Quantity { get; init; }
    }
}
