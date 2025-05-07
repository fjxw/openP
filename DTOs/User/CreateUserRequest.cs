namespace OpenP.DTOs.User;

public record CreateUserRequest
{
    public string? Username { get; init; }
    public string? Email { get; init; }
    public string? Password { get; init; }
}