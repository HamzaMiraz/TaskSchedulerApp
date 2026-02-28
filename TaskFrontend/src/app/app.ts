import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, TodoTask } from './task.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      style="min-height: 100vh; display: flex; flex-direction: column; padding: 40px; box-sizing: border-box; font-family: 'Inter', system-ui, sans-serif; background: radial-gradient(circle at 0% 0%, #1e293b 0%, #0f172a 100%); color: #f8fafc;"
    >
      <header
        style="display: flex; align-items: center; justify-content: space-between; padding: 20px 30px; background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; margin-bottom: 40px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);"
      >
        <div style="display: flex; align-items: center; gap: 15px;">
          <div
            style="width: 45px; height: 45px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 22px; box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);"
          >
            T
          </div>
          <div>
            <h2 style="margin: 0; font-size: 20px; letter-spacing: -0.02em;">
              TaskFlow <span style="font-weight: 300; color: #94a3b8;">Pro</span>
            </h2>
            <p
              style="margin: 0; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;"
            >
              2026 Edition
            </p>
          </div>
        </div>

        <div *ngIf="isLoggedIn" style="display: flex; align-items: center; gap: 20px;">
          <div style="text-align: right;">
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">User</p>
            <p style="margin: 0; font-weight: 600; color: #3b82f6;">{{ loggedInUserName }}</p>
          </div>
          <button
            (click)="doLogout()"
            style="background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); padding: 8px 16px; border-radius: 12px; cursor: pointer; font-weight: 600;"
          >
            Logout
          </button>
        </div>
      </header>

      <main
        style="display: grid; grid-template-columns: 1fr 2.5fr; gap: 30px; max-width: 1300px; margin: 0 auto; width: 100%;"
      >
        <section>
          <div
            *ngIf="!isLoggedIn"
            style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 24px;"
          >
            <div style="display: flex; gap: 10px; margin-bottom: 25px;">
              <button
                (click)="mode = 'login'"
                [style.background]="mode === 'login' ? '#3b82f6' : 'transparent'"
                style="flex: 1; border: none; padding: 10px; border-radius: 10px; color: white; cursor: pointer;"
              >
                Login
              </button>
              <button
                (click)="mode = 'register'"
                [style.background]="mode === 'register' ? '#3b82f6' : 'transparent'"
                style="flex: 1; border: none; padding: 10px; border-radius: 10px; color: white; cursor: pointer;"
              >
                Join
              </button>
            </div>
            <input
              [(ngModel)]="userName"
              placeholder="Username"
              style="width: 100%; padding: 14px; margin-bottom: 12px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: white; outline: none;"
            />
            <input
              [(ngModel)]="password"
              type="password"
              (keyup.enter)="mode === 'login' ? doLogin() : doRegister()"
              placeholder="Password"
              style="width: 100%; padding: 14px; margin-bottom: 20px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: white; outline: none;"
            />
            <button
              (click)="mode === 'login' ? doLogin() : doRegister()"
              style="width: 100%; padding: 14px; background: #3b82f6; color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer;"
            >
              {{ mode === 'login' ? 'Sign In' : 'Create Account' }}
            </button>
            <p
              *ngIf="message"
              [style.color]="messageType === 'error' ? '#f87171' : '#4ade80'"
              style="font-size: 13px; margin-top: 15px; text-align: center;"
            >
              {{ message }}
            </p>
          </div>

          <div
            *ngIf="isLoggedIn"
            style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1)); border: 1px solid rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 24px; text-align: center;"
          >
            <h3 style="margin: 0; color: #94a3b8; font-size: 14px;">Productivity Score</h3>
            <div
              style="font-size: 48px; font-weight: 800; margin: 15px 0; background: linear-gradient(to right, #60a5fa, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
            >
              {{ tasks.length }}
            </div>
            <p style="margin: 0; color: #64748b; font-size: 12px;">Active Tasks</p>
          </div>
        </section>

        <section
          style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px; padding: 30px; min-height: 500px;"
        >
          <div style="margin-bottom: 30px; display: flex; gap: 15px;">
            <input
              [(ngModel)]="newTaskTitle"
              [disabled]="!isLoggedIn"
              placeholder="Enter task and press enter..."
              (keyup.enter)="saveTask()"
              style="flex: 1; padding: 16px 25px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; color: white; font-size: 16px; outline: none;"
            />
            <button
              (click)="saveTask()"
              [disabled]="!isLoggedIn"
              style="background: #3b82f6; color: white; border: none; padding: 0 25px; border-radius: 20px; font-weight: 600; cursor: pointer;"
            >
              Add Task
            </button>
          </div>

          <div
            *ngFor="let t of tasks"
            style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); margin-bottom: 15px; padding: 20px; border-radius: 20px; display: flex; align-items: center; gap: 18px;"
          >
            <div
              (click)="toggleComplete(t)"
              [style.background]="t.isCompleted ? '#22c55e' : 'transparent'"
              style="width: 26px; height: 26px; border: 2px solid #22c55e; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px;"
            >
              {{ t.isCompleted ? '✓' : '' }}
            </div>

            <div style="flex: 1;">
              <ng-container *ngIf="editingId === t.id; else displayMode">
                <input
                  [(ngModel)]="editTitle"
                  (keyup.enter)="saveEdit()"
                  (keyup.escape)="cancelEdit()"
                  style="width: 100%; background: #0f172a; border: 1px solid #3b82f6; padding: 8px 12px; border-radius: 8px; color: white; outline: none; margin-bottom: 5px;"
                />
                <div style="display: flex; gap: 10px;">
                  <button
                    (click)="saveEdit()"
                    style="background: #3b82f6; border: none; color: white; padding: 4px 12px; border-radius: 6px; font-size: 11px; cursor: pointer;"
                  >
                    Save
                  </button>
                  <button
                    (click)="cancelEdit()"
                    style="background: #475569; border: none; color: white; padding: 4px 12px; border-radius: 6px; font-size: 11px; cursor: pointer;"
                  >
                    Cancel
                  </button>
                </div>
              </ng-container>

              <ng-template #displayMode>
                <p
                  [style.text-decoration]="t.isCompleted ? 'line-through' : 'none'"
                  [style.color]="t.isCompleted ? '#64748b' : '#f8fafc'"
                  style="margin: 0; font-size: 16px; font-weight: 500; cursor: pointer;"
                  (click)="startEdit(t)"
                >
                  {{ t.title }}
                </p>
                <span
                  style="font-size: 11px; color: #475569; display: flex; align-items: center; gap: 5px; margin-top: 4px;"
                >
                  🕒 Created: {{ formatCreatedAt(t.createdAt) }}
                </span>
              </ng-template>
            </div>

            <div style="display: flex; gap: 10px;">
              <button
                *ngIf="editingId !== t.id"
                (click)="startEdit(t)"
                style="background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; padding: 6px 10px; border-radius: 10px; cursor: pointer; font-size: 12px;"
              >
                Edit
              </button>
              <button
                (click)="removeTask(t.id!)"
                style="background: rgba(239, 68, 68, 0.1); border: none; color: #ef4444; width: 34px; height: 34px; border-radius: 10px; cursor: pointer;"
              >
                🗑️
              </button>
            </div>
          </div>

          <div
            *ngIf="tasks.length === 0"
            style="text-align: center; color: #475569; margin-top: 60px;"
          >
            <p style="font-size: 40px; margin: 0;">🎯</p>
            <p style="font-size: 14px;">No tasks found.</p>
          </div>
        </section>
      </main>
    </div>
  `,
})
export class App implements OnInit {
  tasks: TodoTask[] = [];
  newTaskTitle: string = '';
  isLoggedIn: boolean = false;
  loggedInUserName: string = '';
  mode: 'login' | 'register' = 'login';
  userName: string = '';
  password: string = '';
  message: string = '';
  messageType: 'error' | 'success' = 'success';

  // Editor State Logic
  editingId: number | null = null;
  editTitle: string = '';

  constructor(
    private service: TaskService,
    private auth: AuthService,
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.loggedInUserName = this.auth.getUserName() ?? '';
    if (this.isLoggedIn) this.load();
  }

  load() {
    this.service.getTasks().subscribe({
      next: (res) => (this.tasks = res),
      error: () => console.error('Failed to load tasks'),
    });
  }

  doLogin() {
    if (!this.userName || !this.password) return;
    this.auth.login(this.userName, this.password).subscribe({
      next: () => {
        this.isLoggedIn = true;
        this.loggedInUserName = this.userName;
        this.message = '';
        this.load();
      },
      error: () => {
        this.messageType = 'error';
        this.message = 'Invalid credentials';
      },
    });
  }

  doRegister() {
    if (!this.userName || !this.password) return;
    this.auth.register(this.userName, this.password).subscribe({
      next: () => {
        this.messageType = 'success';
        this.message = 'Account created! Please login.';
        this.mode = 'login';
      },
      error: (err) => {
        this.messageType = 'error';
        this.message = err?.error?.message || 'Registration failed';
      },
    });
  }

  doLogout() {
    this.auth.logout().subscribe(() => {
      this.isLoggedIn = false;
      this.tasks = [];
      this.loggedInUserName = '';
    });
  }

  saveTask() {
    if (!this.newTaskTitle.trim()) return;
    this.service.addTask({ title: this.newTaskTitle, isCompleted: false }).subscribe(() => {
      this.newTaskTitle = '';
      this.load();
    });
  }

  // --- EDITOR FUNCTIONS ---
  startEdit(t: TodoTask) {
    if (!this.isLoggedIn) return;
    this.editingId = t.id ?? null;
    this.editTitle = t.title;
  }

  saveEdit() {
    if (this.editingId == null || !this.editTitle.trim()) {
      this.cancelEdit();
      return;
    }
    const task = this.tasks.find((t) => t.id === this.editingId);
    if (task) {
      this.service.updateTask({ ...task, title: this.editTitle }).subscribe(() => {
        this.load();
        this.cancelEdit();
      });
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.editTitle = '';
  }

  toggleComplete(t: TodoTask) {
    this.service.updateTask({ ...t, isCompleted: !t.isCompleted }).subscribe(() => this.load());
  }

  removeTask(id: number) {
    this.service.deleteTask(id).subscribe(() => this.load());
  }

  // --- TIME AND DATE FORMATTING ---
  formatCreatedAt(dateString?: string): string {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Just now';

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  }
}

/// new ui
