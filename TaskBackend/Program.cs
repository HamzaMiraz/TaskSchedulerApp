using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer(); // REQUIRED
builder.Services.AddSwaggerGen(); // REQUIRED

builder.Services.AddDbContext<TaskBackend.Data.AppDbContext>(options =>
    options.UseInMemoryDatabase("TaskTrackerDb"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<TaskBackend.Data.AppDbContext>();
    if (!db.Tasks.Any())
    {
        db.Tasks.AddRange(
            new TaskBackend.Models.TodoTask { Title = "Learn ASP.NET Core", IsCompleted = false },
            new TaskBackend.Models.TodoTask { Title = "Build an Angular App", IsCompleted = false }
        );
        db.SaveChanges();
    }
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();       // Generate swagger.json
    app.UseSwaggerUI();    // Show Swagger UI
}

app.UseHttpsRedirection();

app.UseCors("AllowAngular");

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild",
    "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();

    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi(); // 👈 Important for Swagger

app.MapControllers();
app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}