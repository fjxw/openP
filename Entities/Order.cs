using OpenP.Entities;
using OpenP.Enums;

public class Order
{
    public int OrderId { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public DateTime OrderDate { get; set; }
    public string Address { get; set; }
    public string PhoneNumber { get; set; }
    public Statuses Status { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; }
}