using System.ComponentModel.DataAnnotations;
using OpenP.Enums;

namespace OpenP.Entities
{
    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public ICollection<Order> Orders { get; set; } = [];
        public int CartId { get; set; }
        public Cart Cart { get; set; }
        public Roles Role { get; set; } = Roles.User;
    }
}