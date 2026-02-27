using Microsoft.EntityFrameworkCore;
using TaskBackend.Models;

namespace TaskBackend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<TodoTask> Tasks => Set<TodoTask>();
}

