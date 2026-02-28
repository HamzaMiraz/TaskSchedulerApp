namespace TaskBackend.Models;

public record RegisterRequest(string UserName, string Password);
public record LoginRequest(string UserName, string Password);
public record LoginResponse(string Token, string UserName);
public record MeResponse(int UserId, string UserName);

