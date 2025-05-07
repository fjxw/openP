namespace OpenP.DTOs.Order;

public record CreateOrderByCartDto
{
    public string Address { get; init; }
    public string Phone { get; init; }
}