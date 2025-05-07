using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace OpenP.Middleware;

    public class JwtCookieMiddleware(RequestDelegate next)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            if (context.Request.Cookies.TryGetValue("jwt", out var token))
            {
                context.Request.Headers["Authorization"] = $"Bearer {token}";
            }

            await next(context);
        }
    }
