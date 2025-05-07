using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using OpenP.Entities;
using OpenP.Enums;
using OpenP.Repositories;

namespace OpenP.Services
{
    public class AuthService(
        IUserRepository userRepository,
        IConfiguration configuration,
        IPasswordHasher<User?> passwordHasher)
        : IAuthService
    {
        public async Task RegisterUserAsync(string email, string username, string password)
        {
            if (!IsValidEmail(email))
            {
                throw new Exception("Некорректный email");
            }
            var userExists = await userRepository.GetUserByEmailAsync(email);
            if (userExists != null)
            {
                throw new Exception("Пользователь уже существует");
            }
            var user = new User()
            {
                Email = email,
                Username = username,
                Role = Roles.User,
            };
            var passwordHasher = new PasswordHasher<User>().HashPassword(user, password);
            user.PasswordHash = passwordHasher;
            await userRepository.AddUserAsync(user);
        }

        public async Task<string> LoginAsync(string email, string password)
        {
            var user = await userRepository.GetUserByEmailAsync(email);
            if (user == null)
            {
                throw new Exception("Пользователь не найден");
            }
            var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            if (result == PasswordVerificationResult.Failed)
            {
                throw new Exception("Неверный пароль");
            }
            var tokenHandler = new JwtSecurityTokenHandler();
            
            var singingCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"])),
                SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = singingCredentials
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        
        private static bool IsValidEmail(string email)
        {
            try
            {
                var mailAddress = new MailAddress(email); 
                return true;
            }
            catch (Exception)
            {
                return false; 
            }
        }
    }
}
