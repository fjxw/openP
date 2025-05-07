using OpenP.Entities;

namespace OpenP.Services;

public interface IAuthService
{
    Task RegisterUserAsync(string email, string username, string password);
    Task<string> LoginAsync(string username, string password);
}