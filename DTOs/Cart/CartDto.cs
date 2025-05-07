namespace OpenP.DTOs.Cart;

public record CartDto
{
    public int CartId { get; init; }
    public int UserId { get; init; }
    public List<CartItemDto> Items { get; init; } = new List<CartItemDto>();
}

public record CartItemDto
{
    public int ProductId { get; init; }
    public int Quantity { get; init; }
}