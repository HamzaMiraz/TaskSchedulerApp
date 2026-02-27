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
        var tasks = await _db.Tasks.OrderByDescending(t => t.CreatedAt).ToListAsync();
        return Ok(tasks);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TodoTask>> GetTask(int id)
    {
        var task = await _db.Tasks.FindAsync(id);
        if (task == null) return NotFound();
        return Ok(task);
    }

    // POST: api/tasks
    [HttpPost]
    public async Task<ActionResult<TodoTask>> CreateTask(TodoTask newTask)
    {
        newTask.Id = 0;
        if (newTask.CreatedAt == default)
        {
            newTask.CreatedAt = DateTime.Now;
        }

        _db.Tasks.Add(newTask);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTask), new { id = newTask.Id }, newTask);
    }

    // DELETE: api/tasks/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var task = await _db.Tasks.FindAsync(id);
        if (task == null) return NotFound();

        _db.Tasks.Remove(task);
        await _db.SaveChangesAsync();
        return NoContent();
    }

}