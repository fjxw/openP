namespace OpenP.DTOs.Cart;

public class CartDto
{
    public int CartId { get; set; }
    public int UserId { get; set; }
    public List<CartItemDto> Items { get; set; } = new List<CartItemDto>();
    public decimal TotalPrice { get; set; } 
}

public class CartItemDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}