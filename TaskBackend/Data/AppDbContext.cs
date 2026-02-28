using Microsoft.EntityFrameworkCore;
using TaskBackend.Models;

namespace TaskBackend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<TodoTask> Tasks => Set<TodoTask>();
    public DbSet<AppUser> Users => Set<AppUser>();
    public DbSet<UserSession> Sessions => Set<UserSession>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<AppUser>()
            .HasIndex(u => u.NormalizedUserName)
            .IsUnique();

        modelBuilder.Entity<UserSession>()
            .HasIndex(s => s.Token)
            .IsUnique();

        modelBuilder.Entity<TodoTask>()
            .HasIndex(t => new { t.UserId, t.CreatedAt });
    }
}

