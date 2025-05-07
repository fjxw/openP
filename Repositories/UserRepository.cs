using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OpenP.Data;
using OpenP.Entities;
using OpenP.Enums;
using OpenP.Repositories;

public class UserRepository(ApplicationDbContext context) : IUserRepository
{
    public async Task<User?> GetUserByIdAsync(int userId)
    {
        return await context.Users.FindAsync(userId);
    }

    public async Task<User> GetUserByUsernameAsync(string username)
    {
        return await context.Users.FirstOrDefaultAsync(u => u.Username == username);
    }
    
    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }
    
    public async Task<int> GetTotalUsersCountAsync()
    {
        return await context.Users.CountAsync();
    }
    
    public async Task<IEnumerable<User?>> GetUsersByRoleAsync(Roles role, int pageNumber, int pageSize)
    {
        return await context.Users
            .Where(u => u.Role == role)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }
    
    public async Task<IEnumerable<User?>> GetAllUsersAsync(int pageNumber, int pageSize)
    {
        return await context.Users
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task AddUserAsync(User? user)
    {
        if (user == null) return;
        
        // First save the user to get a valid UserId
        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();
        
        // Now create a cart for this user
        var cart = new Cart { UserId = user.UserId };
        await context.Carts.AddAsync(cart);
        await context.SaveChangesAsync();
        
        // Update the user with the new CartId
        user.CartId = cart.CartId;
        context.Users.Update(user);
        await context.SaveChangesAsync();
    }

    public async Task UpdateUserAsync(User? user)
    {
        context.Users.Update(user);
        await context.SaveChangesAsync();
    }

    public async Task DeleteUserAsync(int userId)
    {
        var user = await context.Users
            .Include(u => u.Orders)
            .Include(u => u.Cart)
                .ThenInclude(c => c.CartItems)
            .FirstOrDefaultAsync(u => u.UserId == userId);
            
        if (user != null)
        {
            // If we need to handle any order cleanup manually
            // Remove cart items first to avoid foreign key issues
            if (user.Cart?.CartItems != null)
            {
                context.CartItems.RemoveRange(user.Cart.CartItems);
            }
            
            // Then remove the user
            context.Users.Remove(user);
            await context.SaveChangesAsync();
        }
    }
}