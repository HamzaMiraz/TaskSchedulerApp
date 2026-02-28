import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, TodoTask } from './task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  // We add CommonModule for loops and FormsModule for the input box
  imports: [CommonModule, FormsModule],
  template: `
    <div
      style="max-width: 500px; margin: 50px auto; text-align: center; font-family: sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 8px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);"
    >
      <h1 style="color: #007bff;">Noob Task Tracker</h1>

      <div style="margin-bottom: 20px;">
        <input
          [(ngModel)]="newTaskTitle"
          placeholder="Enter a new task..."
          style="padding: 10px; width: 250px; border: 1px solid #ccc; border-radius: 4px;"
        />
        <button
          (click)="saveTask()"
          style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 5px;"
        >
          Add Task
        </button>
      </div>

      <div *ngIf="tasks.length === 0" style="color: #888;">
        No tasks yet. Your backend list is empty!
      </div>

      <div
        *ngFor="let t of tasks"
        style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #eee; gap: 8px;"
      >
        <input
          type="checkbox"
          [checked]="t.isCompleted"
          (change)="toggleComplete(t)"
          style="cursor: pointer; flex-shrink: 0;"
          title="Mark complete / incomplete"
        />
        @if (editingId === t.id) {
          <input
            [(ngModel)]="editTitle"
            (keyup.enter)="saveEdit()"
            (keyup.escape)="cancelEdit()"
            style="flex: 1; padding: 6px 8px; border: 1px solid #007bff; border-radius: 4px;"
          />
          <button
            (click)="saveEdit()"
            style="background: #007bff; color: white; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer;"
          >
            Save
          </button>
          <button
            (click)="cancelEdit()"
            style="background: #6c757d; color: white; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer;"
          >
            Cancel
          </button>
        } @else {
          <span
            (click)="startEdit(t)"
            [style.text-decoration]="t.isCompleted ? 'line-through' : 'none'"
            [style.color]="t.isCompleted ? '#888' : 'inherit'"
            style="flex: 1; text-align: left; cursor: pointer;"
            title="Click to edit"
          >{{ t.title }}</span>
          <button
            (click)="startEdit(t)"
            style="background: #ffc107; color: #333; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer;"
          >
            Edit
          </button>
          <button
            (click)="removeTask(t.id!)"
            style="background: #dc3545; color: white; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer;"
          >
            Delete
          </button>
        }
      </div>
    </div>
  `,
})
export class App implements OnInit {
  tasks: TodoTask[] = [];
  newTaskTitle: string = '';
  editingId: number | null = null;
  editTitle: string = '';

  constructor(private service: TaskService) {}

  ngOnInit() {
    this.load();
  }

  // Fetch tasks from C# API
  load() {
    this.service.getTasks().subscribe({
      next: (res) => (this.tasks = res),
      error: (err) => alert('Error: Is your Backend running at http://localhost:5112?'),
    });
  }

  // Send new task to C# API
  saveTask() {
    if (!this.newTaskTitle.trim()) return;

    const newTask: TodoTask = {
      title: this.newTaskTitle,
      isCompleted: false,
    };

    this.service.addTask(newTask).subscribe({
      next: () => {
        this.newTaskTitle = '';
        this.load();
      },
      error: (err) => alert('Failed to add task.'),
    });
  }

  // Toggle task complete/incomplete (PUT)
  toggleComplete(t: TodoTask) {
    const updated = { ...t, isCompleted: !t.isCompleted };
    this.service.updateTask(updated).subscribe({
      next: () => this.load(),
      error: () => alert('Failed to update task.'),
    });
  }

  // Start editing task title
  startEdit(t: TodoTask) {
    this.editingId = t.id ?? null;
    this.editTitle = t.title;
  }

  // Save edited title (PUT)
  saveEdit() {
    if (this.editingId == null) return;
    const task = this.tasks.find((x) => x.id === this.editingId);
    if (!task || !this.editTitle.trim()) {
      this.cancelEdit();
      return;
    }
    const updated = { ...task, title: this.editTitle.trim() };
    this.service.updateTask(updated).subscribe({
      next: () => {
        this.load();
        this.editingId = null;
        this.editTitle = '';
      },
      error: () => alert('Failed to update task.'),
    });
  }

  cancelEdit() {
    this.editingId = null;
    this.editTitle = '';
  }

  // Delete task from C# API
  removeTask(id: number) {
    this.service.deleteTask(id).subscribe(() => {
      this.load();
    });
  }
}
