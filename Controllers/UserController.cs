using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using OpenP.DTOs.User;
using OpenP.Entities;
using OpenP.Enums;
using OpenP.Repositories;

namespace OpenP.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(IUserRepository userRepository, IPasswordHasher<User> passwordHasher) : ControllerBase
    {
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("Пользователь не авторизован");
            return int.Parse(userIdClaim.Value);
        }
        
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetUser()
        {
            try
            {
                var id = GetCurrentUserId();
                var user = await userRepository.GetUserByIdAsync(id);
                return Ok(new UserDto
                {
                    UserId = user.UserId,
                    Email = user.Email,
                    Username = user.Username,
                    Role = user.Role.ToString()
                });
            }
            catch (Exception e)
            {
                return NotFound(new { message = e.Message });
            }
        }
        
        [HttpGet("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            try
            {
                var user = await userRepository.GetUserByIdAsync(id);
                return Ok(new UserDto
                {
                    UserId = user.UserId,
                    Email = user.Email,
                    Username = user.Username,
                    Role = user.Role.ToString()
                });
            }
            catch (Exception e)
            {
                return NotFound(new { message = e.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserDto>> CreateUser(CreateUserRequest request)
        {
            if (Enum.TryParse<Roles>(request.Role, out var role))
            {
                return BadRequest(new { message = "Некорректная роль" });
            }
            var user = new User
            {
                Username = request.Username,
                Role = role,
            };
            user.PasswordHash = passwordHasher.HashPassword(user, request.Password);
            await userRepository.AddUserAsync(user);
            return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, new UserDto
            {
                UserId = user.UserId,
                Username = user.Username,
                Role = user.Role.ToString(),
            });
        }

        [HttpPatch]
        [Authorize(Roles = "User, Admin")]
        public async Task<IActionResult> UpdateUser(CreateUserRequest request)
        {
            var id = GetCurrentUserId();
            try
            {
                var user = await userRepository.GetUserByIdAsync(id);
                if (request.Username != null)
                    user.Username = request.Username;
                if (request.Email != null)
                    user.Email = request.Email;
                if (request.Password != null)
                    user.PasswordHash = passwordHasher.HashPassword(user, request.Password);
                await userRepository.UpdateUserAsync(user);
                return NoContent();
            }
            catch (Exception e)
            {
                return NotFound(new { message = "Пользователь не найден" });
            }
        }
        
        [HttpPatch("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateUser(int id, CreateUserRequest request)
        {
            try
            {
                var user = await userRepository.GetUserByIdAsync(id);
                if (request.Username != null)
                    user.Username = request.Username;
                if (request.Email != null)
                    user.Email = request.Email;
                if (request.Password != null)
                    user.PasswordHash = passwordHasher.HashPassword(user, request.Password);
                await userRepository.UpdateUserAsync(user);
                return NoContent();
            }
            catch (Exception e)
            {
                return NotFound(new { message = "Пользователь не найден" });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                await userRepository.DeleteUserAsync(id);
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "Ошибка при удалении пользователя", error = e.Message });
            }
        }

        [HttpDelete]
        [Authorize(Roles = "User, Admin")]
        public async Task<IActionResult> DeleteCurrentUser()
        {
            try
            {
                var id = GetCurrentUserId();
                await userRepository.DeleteUserAsync(id);
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "Ошибка при удалении пользователя", error = e.Message });
            }
        }
    }
}