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
}

app.UseCors("CorsPolicy");
app.UseRouting();
app.UseHttpsRedirection();
app.UseMiddleware<JwtCookieMiddleware>();
app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<AntiforgeryTokenMiddleware>();
app.UseAntiforgery();
app.UseSwagger();
app.UseSwaggerUI();
app.MapControllers();

await app.InitAndRunAsync();