using Microsoft.EntityFrameworkCore;
using TaskBackend.Data;

namespace TaskBackend.Auth;

public class AuthMiddleware
{
    private readonly RequestDelegate _next;

    public AuthMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, AppDbContext db)
    {
        var token = GetToken(context);
        if (!string.IsNullOrWhiteSpace(token))
        {
            var now = DateTime.UtcNow;
            var session = await db.Sessions
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Token == token && s.ExpiresAt > now);

            if (session != null)
            {
                context.Items["UserId"] = session.UserId;
            }
        }

        await _next(context);
    }

    private static string? GetToken(HttpContext context)
    {
        if (context.Request.Headers.TryGetValue("X-Auth-Token", out var xAuth) && !string.IsNullOrWhiteSpace(xAuth))
            return xAuth.ToString().Trim();

        if (context.Request.Headers.TryGetValue("Authorization", out var auth) && !string.IsNullOrWhiteSpace(auth))
        {
            var value = auth.ToString().Trim();
            const string bearer = "Bearer ";
            if (value.StartsWith(bearer, StringComparison.OrdinalIgnoreCase))
                return value[bearer.Length..].Trim();
        }

        return null;
    }
}

