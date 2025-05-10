using OpenP.Entities;

namespace OpenP.Services;

public interface IAuthService
{
    Task RegisterUserAsync(string email, string username, string password);
    Task<string> LoginAsync(string email, string password);
    Task ResetPasswordAsync(string email, string newPassword);
}