namespace OpenP.Middleware;

using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

public class AntiforgeryTokenMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        if (HttpMethods.IsOptions(context.Request.Method))
        {
            await next(context);
            return;
        }

        if (context.Request.Cookies.TryGetValue("XSRF-TOKEN", out var token))
        {
            context.Request.Headers["X-XSRF-TOKEN"] = token;
        }

        await next(context);
    }
}
