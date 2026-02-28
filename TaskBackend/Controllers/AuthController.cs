using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using TaskBackend.Data;
using TaskBackend.Models;
using TaskBackend.Security;

namespace TaskBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;

    public AuthController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        var userName = (req.UserName ?? string.Empty).Trim();
        var password = req.Password ?? string.Empty;

        if (string.IsNullOrWhiteSpace(userName) || string.IsNullOrWhiteSpace(password))
            return BadRequest(new { message = "UserName and Password are required." });

        var normalized = userName.ToLowerInvariant();
        var exists = await _db.Users.AnyAsync(u => u.NormalizedUserName == normalized);
        if (exists)
            return Conflict(new { message = "User already exists. Choose a different username." });

        var user = new AppUser
        {
            UserName = userName,
            NormalizedUserName = normalized,
            PasswordHash = PasswordHash.Hash(password),
            CreatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return Created("", new { userName = user.UserName });
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest req)
    {
        var userName = (req.UserName ?? string.Empty).Trim();
        var password = req.Password ?? string.Empty;

        if (string.IsNullOrWhiteSpace(userName) || string.IsNullOrWhiteSpace(password))
            return Unauthorized(new { message = "Invalid username or password." });

        var normalized = userName.ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.NormalizedUserName == normalized);
        if (user == null || !PasswordHash.Verify(password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid username or password." });

        var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
        var session = new UserSession
        {
            Token = token,
            UserId = user.Id,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        _db.Sessions.Add(session);
        await _db.SaveChangesAsync();

        return Ok(new LoginResponse(token, user.UserName));
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var token = GetTokenFromRequest();
        if (string.IsNullOrWhiteSpace(token))
            return NoContent();

        var sessions = await _db.Sessions.Where(s => s.Token == token).ToListAsync();
        if (sessions.Count == 0) return NoContent();

        _db.Sessions.RemoveRange(sessions);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("me")]
    public async Task<ActionResult<MeResponse>> Me()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized(new { message = "Not logged in." });

        var user = await _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId.Value);
        if (user == null) return Unauthorized(new { message = "Not logged in." });

        return Ok(new MeResponse(user.Id, user.UserName));
    }

    private int? GetUserId()
    {
        if (HttpContext.Items.TryGetValue("UserId", out var v) && v is int userId)
            return userId;
        return null;
    }

    private string? GetTokenFromRequest()
    {
        if (Request.Headers.TryGetValue("X-Auth-Token", out var xAuth) && !string.IsNullOrWhiteSpace(xAuth))
            return xAuth.ToString().Trim();

        if (Request.Headers.TryGetValue("Authorization", out var auth) && !string.IsNullOrWhiteSpace(auth))
        {
            var value = auth.ToString().Trim();
            const string bearer = "Bearer ";
            if (value.StartsWith(bearer, StringComparison.OrdinalIgnoreCase))
                return value[bearer.Length..].Trim();
        }

        return null;
    }
}

