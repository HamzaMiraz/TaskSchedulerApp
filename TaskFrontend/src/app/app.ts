import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, TodoTask } from './task.service';
import { AuthService } from './auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  // We add CommonModule for loops and FormsModule for the input box
  imports: [CommonModule, FormsModule],
  template: `
    <div style="max-width: 560px; margin: 50px auto; font-family: sans-serif;">
      @if (!isLoggedIn) {
        <div
          style="border: 1px solid #ddd; padding: 24px; border-radius: 10px; box-shadow: 2px 2px 10px rgba(0,0,0,0.07);"
        >
          <h1 style="color: #007bff; text-align: center; margin-top: 0;">Task Tracker</h1>

          <div style="display: flex; justify-content: center; gap: 8px; margin: 16px 0 22px 0;">
            <button
              (click)="mode = 'login'; message = ''"
              [style.background]="mode === 'login' ? '#007bff' : '#e9ecef'"
              [style.color]="mode === 'login' ? 'white' : '#333'"
              style="border: none; padding: 8px 14px; border-radius: 8px; cursor: pointer;"
            >
              Login
            </button>
            <button
              (click)="mode = 'register'; message = ''"
              [style.background]="mode === 'register' ? '#007bff' : '#e9ecef'"
              [style.color]="mode === 'register' ? 'white' : '#333'"
              style="border: none; padding: 8px 14px; border-radius: 8px; cursor: pointer;"
            >
              Create account
            </button>
          </div>

          <div style="display: grid; gap: 12px;">
            <input
              [(ngModel)]="userName"
              placeholder="User name"
              style="padding: 10px; border: 1px solid #ccc; border-radius: 8px;"
            />
            <input
              [(ngModel)]="password"
              type="password"
              placeholder="Password"
              style="padding: 10px; border: 1px solid #ccc; border-radius: 8px;"
            />

            @if (message) {
              <div
                style="padding: 10px; border-radius: 8px;"
                [style.background]="messageType === 'error' ? '#fff1f2' : '#ecfdf3'"
                [style.border]="messageType === 'error' ? '1px solid #fecdd3' : '1px solid #bbf7d0'"
                [style.color]="messageType === 'error' ? '#9f1239' : '#166534'"
              >
                {{ message }}
              </div>
            }

            @if (mode === 'login') {
              <button
                (click)="doLogin()"
                style="padding: 10px 16px; background: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer;"
              >
                Login
              </button>
            } @else {
              <button
                (click)="doRegister()"
                style="padding: 10px 16px; background: #007bff; color: white; border: none; border-radius: 8px; cursor: pointer;"
              >
                Create account
              </button>
            }
          </div>
        </div>
      } @else {
        <div
          style="border: 1px solid #ddd; padding: 20px; border-radius: 10px; box-shadow: 2px 2px 10px rgba(0,0,0,0.07);"
        >
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
            <div style="text-align: left;">
              <div style="font-size: 20px; font-weight: 700; color: #007bff;">Noob Task Tracker</div>
              <div style="font-size: 12px; color: #6c757d;">Logged in as: {{ loggedInUserName }}</div>
            </div>
            <button
              (click)="doLogout()"
              style="padding: 8px 12px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer;"
            >
              Logout
            </button>
          </div>

          <div style="margin: 18px 0 12px 0; display: flex; justify-content: center; gap: 6px;">
            <input
              [(ngModel)]="newTaskTitle"
              placeholder="Enter a new task..."
              style="padding: 10px; width: 280px; border: 1px solid #ccc; border-radius: 8px;"
            />
            <button
              (click)="saveTask()"
              style="padding: 10px 16px; background: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer;"
            >
              Add Task
            </button>
          </div>

          <div *ngIf="tasks.length === 0" style="color: #888; text-align: center; padding: 10px 0;">
            No tasks yet.
          </div>

          <div
            *ngFor="let t of tasks"
            style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee; gap: 8px;"
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
                style="flex: 1; padding: 6px 8px; border: 1px solid #007bff; border-radius: 8px;"
              />
              <button
                (click)="saveEdit()"
                style="background: #007bff; color: white; border: none; padding: 6px 10px; border-radius: 8px; cursor: pointer;"
              >
                Save
              </button>
              <button
                (click)="cancelEdit()"
                style="background: #6c757d; color: white; border: none; padding: 6px 10px; border-radius: 8px; cursor: pointer;"
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
              >
                {{ t.title }}
              </span>
              <button
                (click)="startEdit(t)"
                style="background: #ffc107; color: #333; border: none; padding: 6px 10px; border-radius: 8px; cursor: pointer;"
              >
                Edit
              </button>
              <button
                (click)="removeTask(t.id!)"
                style="background: #dc3545; color: white; border: none; padding: 6px 10px; border-radius: 8px; cursor: pointer;"
              >
                Delete
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class App implements OnInit {
  tasks: TodoTask[] = [];
  newTaskTitle: string = '';
  editingId: number | null = null;
  editTitle: string = '';

  mode: 'login' | 'register' = 'login';
  userName: string = '';
  password: string = '';
  message: string = '';
  messageType: 'error' | 'success' = 'success';
  isLoggedIn: boolean = false;
  loggedInUserName: string = '';

  constructor(private service: TaskService, private auth: AuthService) {}

  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.loggedInUserName = this.auth.getUserName() ?? '';
    if (this.isLoggedIn) {
      this.load();
    }
  }

  // Fetch tasks from C# API
  load() {
    this.service.getTasks().subscribe({
      next: (res) => (this.tasks = res),
      error: (err) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          this.isLoggedIn = false;
          this.loggedInUserName = '';
          this.messageType = 'error';
          this.message = 'Please login first.';
          return;
        }
        alert('Error: Is your Backend running at http://localhost:5112?');
      },
    });
  }

  doRegister() {
    const u = this.userName.trim();
    const p = this.password;
    if (!u || !p) {
      this.messageType = 'error';
      this.message = 'User name and password are required.';
      return;
    }

    this.auth.register(u, p).subscribe({
      next: () => {
        this.messageType = 'success';
        this.message = 'Account created. Now you can login.';
        this.mode = 'login';
        this.password = '';
      },
      error: (err: unknown) => {
        const msg = this.extractMessage(err) ?? 'Failed to create account.';
        this.messageType = 'error';
        this.message = msg;
      },
    });
  }

  doLogin() {
    const u = this.userName.trim();
    const p = this.password;
    if (!u || !p) {
      this.messageType = 'error';
      this.message = 'User name and password are required.';
      return;
    }

    this.auth.login(u, p).subscribe({
      next: () => {
        this.isLoggedIn = true;
        this.loggedInUserName = this.auth.getUserName() ?? u;
        this.message = '';
        this.password = '';
        this.load();
      },
      error: (err: unknown) => {
        const msg = this.extractMessage(err) ?? 'Invalid username or password.';
        this.messageType = 'error';
        this.message = msg;
      },
    });
  }

  doLogout() {
    this.auth.logout().subscribe({
      next: () => {
        this.isLoggedIn = false;
        this.loggedInUserName = '';
        this.tasks = [];
        this.newTaskTitle = '';
        this.cancelEdit();
        this.mode = 'login';
        this.messageType = 'success';
        this.message = 'Logged out.';
      },
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

  private extractMessage(err: unknown): string | null {
    if (!(err instanceof HttpErrorResponse)) return null;
    const body = err.error as any;
    if (body && typeof body.message === 'string') return body.message;
    return null;
  }
}
