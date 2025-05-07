using System;
using System.Collections.Generic;
using OpenP.Enums;

namespace OpenP.DTOs.Order
{
    public class OrderDto
    {
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public List<OrderItemDto> OrderItems { get; set; }
        public decimal TotalAmount { get; set; }
    }

    public record OrderItemDto
    {
        public int ProductId { get; init; }
        public decimal Price { get; init; }
        public int Quantity { get; init; }
    }
}