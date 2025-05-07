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
    public class AuthController(AuthService authService, IUserRepository userRepository) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CreateUserRequest request)
        {
            await authService.RegisterUserAsync(request.Email, request.Username, request.Password);
            var result = await authService.LoginAsync(request.Email, request.Password);
            Response.Cookies.Append("jwt", result, new CookieOptions { HttpOnly = true });
            return Ok(new { message = "Пользователь успешно зарегистрирован", token = result });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto request)
        {
            try
            {
                var result = await authService.LoginAsync(request.Email, request.Password);
                Response.Cookies.Append("jwt", result, new CookieOptions { HttpOnly = true });
                return Ok(new { message = "Вход успешно выполнен", token = result });
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