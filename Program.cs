using OpenP.Extensions;
using OpenP.Middleware;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions()
{
    WebRootPath = "Files",
    Args = args
});

builder.WebHost.UseUrls("http://localhost:5093");

builder.Services.AddDependencies(builder.Configuration);

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");

app.UseMiddleware<AntiforgeryTokenMiddleware>();
app.UseAntiforgery();
app.UseHttpsRedirection();
app.UseRouting();
app.UseMiddleware<JwtCookieMiddleware>();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

await app.InitAndRunAsync();