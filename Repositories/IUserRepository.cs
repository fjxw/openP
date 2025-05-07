using OpenP.Enums;

namespace OpenP.Repositories;

using OpenP.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IUserRepository
{
    Task<User?> GetUserByIdAsync(int userId);
    Task<User> GetUserByUsernameAsync(string username);
    Task<IEnumerable<User?>> GetAllUsersAsync(int pageNumber, int pageSize);
    Task AddUserAsync(User? user);
    Task UpdateUserAsync(User? user);
    Task DeleteUserAsync(int userId);
    Task<User?> GetUserByEmailAsync(string email);
    Task<IEnumerable<User?>> GetUsersByRoleAsync(Roles role, int pageNumber, int pageSize);
    Task<int> GetTotalUsersCountAsync();
}