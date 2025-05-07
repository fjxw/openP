namespace OpenP.DTOs.User
{
    public record UserDto
    {
        public int UserId { get; init; }
        public string Username { get; init; }
        public string Email { get; init; }
        public string Role { get; init; }
    }
}