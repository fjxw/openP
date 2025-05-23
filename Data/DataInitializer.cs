using Extensions.Hosting.AsyncInitialization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OpenP.Entities;
using OpenP.Enums;

namespace OpenP.Data;

public class DataInitializer(
    ApplicationDbContext context,
    IConfiguration configuration,
    IPasswordHasher<User> passwordHasher) : IAsyncInitializer
{
    public async Task InitializeAsync(CancellationToken cancellationToken)
    {
        await context.Database.MigrateAsync(cancellationToken);
        
        var adminUser = await context.Users
            .FirstOrDefaultAsync(u => u.Role == Roles.Admin, cancellationToken);
        
        
        if (adminUser == null)
        {
         
            adminUser = new User
            {
                Username = configuration["AdminCredentials:Username"],
                Email = configuration["AdminCredentials:Email"],
                Role = Roles.Admin,
            };
            var hashPassword = passwordHasher.HashPassword(adminUser, configuration["AdminCredentials:Password"]);
            adminUser.PasswordHash = hashPassword;
            context.Users.Add(adminUser);
        }
        else
        {
        
            adminUser.Username = configuration["AdminCredentials:Username"];
            adminUser.Email = configuration["AdminCredentials:Email"];
            var hashPassword = passwordHasher.HashPassword(adminUser, configuration["AdminCredentials:Password"]);
            adminUser.PasswordHash = hashPassword;
        }
        
        await context.SaveChangesAsync(cancellationToken);
    }
}