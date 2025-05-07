using OpenP.Enums;

namespace OpenP.DTOs.Order
{
    public record UpdateOrderDto
    {
        
        public string? PhoneNumber { get; init; }
        public string? Address { get; init; }
        public string? Status { get; init; }
    }
}
