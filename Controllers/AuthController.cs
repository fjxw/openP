using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using OpenP.DTOs.User;
using OpenP.Services;
using Microsoft.AspNetCore.Authorization;
using OpenP.Repositories;

namespace OpenP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService, IUserRepository userRepository) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto request)
        {
            await authService.RegisterUserAsync(request.Email, request.Username, request.Password);
            var token = await authService.LoginAsync(request.Email, request.Password);
            Response.Cookies.Append("jwt", token, new CookieOptions { HttpOnly = true });
           
            var user = await userRepository.GetUserByEmailAsync(request.Email);
            var userDto = new UserDto
            {
                UserId = user.UserId,
                Email = user.Email,
                Username = user.Username,
                Role = user.Role.ToString()
            };
            
            return Ok(userDto);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto request)
        {
            try
            {
                var token = await authService.LoginAsync(request.Email, request.Password);
                Response.Cookies.Append("jwt", token, new CookieOptions { HttpOnly = true });
                
                var user = await userRepository.GetUserByEmailAsync(request.Email);
                var userDto = new UserDto
                {
                    UserId = user.UserId,
                    Email = user.Email,
                    Username = user.Username,
                    Role = user.Role.ToString()
                };
                
                return Ok(userDto);
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message});
            }
                
        }

        [HttpGet("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");
            return Ok(new { message = "Выход выполнен успешно" });
        }
    }
}