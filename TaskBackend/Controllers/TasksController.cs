using Microsoft.AspNetCore.Mvc;
using TaskBackend.Models;

namespace TaskBackend.Controllers;

[ApiController]
[Route("api/[Controller]")] // This makes the URL: api/tasks
public class TasksController : ControllerBase
{
    // Temporary "In-Memory" storage
    private static List<TodoTask> _tasks = new List<TodoTask>
    {
        new TodoTask { Id = 1, Title = "Learn ASP.NET Core", IsCompleted = false },
        new TodoTask { Id = 2, Title = "Build an Angular App", IsCompleted = false }
    };

    // GET: api/tasks
    [HttpGet]
    public ActionResult<IEnumerable<TodoTask>> GetTasks()
    {
        return Ok(_tasks);
    }

    [HttpGet("{id}")]
    public ActionResult<TodoTask> GetTask(int id)
    {
        var task = _tasks.FirstOrDefault(t => t.Id == id);
        if (task == null) return NotFound();
        return Ok(task);
    }

    // POST: api/tasks
    [HttpPost]
    public ActionResult<TodoTask> CreateTask(TodoTask newTask)
    {
        newTask.Id = _tasks.Count > 0 ? _tasks.Max(t => t.Id) + 1 : 1;
        _tasks.Add(newTask);
        return CreatedAtAction(nameof(GetTasks), new { id = newTask.Id }, newTask);
    }

    // DELETE: api/tasks/1
    [HttpDelete("{id}")]
    public IActionResult DeleteTask(int id)
    {
        var task = _tasks.FirstOrDefault(t => t.Id == id);
        if (task == null) return NotFound();

        _tasks.Remove(task);
        return NoContent();
    }

}