namespace OpenP.DTOs.User;

public record RegisterUserDto
{
    public string? Username { get; init; }
    public string? Email { get; init; }
    public string? Password { get; init; }
}