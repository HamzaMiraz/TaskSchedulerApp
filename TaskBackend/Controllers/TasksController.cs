using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskBackend.Data;
using TaskBackend.Models;

namespace TaskBackend.Controllers;

[ApiController]
[Route("api/[Controller]")] // This makes the URL: api/tasks
public class TasksController : ControllerBase
{
    private readonly AppDbContext _db;

    public TasksController(AppDbContext db)
    {
        _db = db;
    }

    // GET: api/tasks
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoTask>>> GetTasks()
    {
        var userId = GetUserIdOrNull();
        if (userId == null) return Unauthorized(new { message = "Not logged in." });

        var tasks = await _db.Tasks
            .AsNoTracking()
            .Where(t => t.UserId == userId.Value)
            .OrderBy(t => t.Deadline == null) // Tasks with deadlines first
            .ThenBy(t => t.Deadline)          // Soonest deadlines first
            .ThenByDescending(t => t.CreatedAt)
            .ToListAsync();
        return Ok(tasks);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TodoTask>> GetTask(int id)
    {
        var userId = GetUserIdOrNull();
        if (userId == null) return Unauthorized(new { message = "Not logged in." });

        var task = await _db.Tasks
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId.Value);
        if (task == null) return NotFound();
        return Ok(task);
    }

    // POST: api/tasks
    [HttpPost]
    public async Task<ActionResult<TodoTask>> CreateTask(TodoTask newTask)
    {
        var userId = GetUserIdOrNull();
        if (userId == null) return Unauthorized(new { message = "Not logged in." });

        newTask.Id = 0;
        newTask.UserId = userId.Value;
        if (newTask.CreatedAt == default)
        {
            newTask.CreatedAt = DateTime.UtcNow;
        }

        // Validation removed to avoid timezone issues (user can set any date)

        _db.Tasks.Add(newTask);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTask), new { id = newTask.Id }, newTask);
    }

    // UPDATE: api/tasks/1
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, TodoTask updatedTask)
    {
        var userId = GetUserIdOrNull();
        if (userId == null) return Unauthorized(new { message = "Not logged in." });
        if (id != updatedTask.Id) return BadRequest();

        var existing = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId.Value);
        if (existing == null) return NotFound();

        // Validation removed to avoid timezone issues
        
        existing.Title = updatedTask.Title ?? string.Empty;
        existing.IsCompleted = updatedTask.IsCompleted;
        existing.Deadline = updatedTask.Deadline;
        
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/tasks/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var userId = GetUserIdOrNull();
        if (userId == null) return Unauthorized(new { message = "Not logged in." });

        var task = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId.Value);
        if (task == null) return NotFound();

        _db.Tasks.Remove(task);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private int? GetUserIdOrNull()
    {
        if (HttpContext.Items.TryGetValue("UserId", out var v) && v is int userId)
            return userId;
        return null;
    }
}