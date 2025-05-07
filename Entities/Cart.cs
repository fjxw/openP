using OpenP.Entities;

public class Cart
{
    public int CartId { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public ICollection<CartItem> CartItems { get; set; } = [];
}