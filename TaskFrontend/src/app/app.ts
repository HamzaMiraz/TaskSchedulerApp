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
            style="width: 45px; height: 45px; background: linear-gradient(135deg, #0ea5e9, #6366f1); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 22px; box-shadow: 0 0 20px rgba(14, 165, 233, 0.4);"
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
          <!-- NOTIFICATION BELL -->
          <div style="position: relative;">
            <button
              (click)="toggleNotifications()"
              style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); width: 42px; height: 42px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; position: relative; font-size: 20px;"
            >
              🔔
              <div
                *ngIf="pastDueTasks.length > 0"
                style="position: absolute; top: -5px; right: -5px; background: #ef4444; color: white; border-radius: 50%; width: 22px; height: 22px; font-size: 11px; font-weight: bold; display: flex; align-items: center; justify-content: center; border: 2px solid #0f172a; box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);"
              >
                {{ pastDueTasks.length }}
              </div>
            </button>

            <!-- NOTIFICATION DROPDOWN -->
            <div
              *ngIf="showNotifications"
              style="position: absolute; top: 55px; right: 0; width: 320px; background: #1e293b; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4); z-index: 1000; overflow: hidden; animation: slideDown 0.2s ease-out;"
            >
              <div style="padding: 15px 20px; background: rgba(255, 255, 255, 0.02); border-bottom: 1px solid rgba(255, 255, 255, 0.05); display: flex; justify-content: space-between; align-items: center;">
                <h4 style="margin: 0; font-size: 14px; font-weight: 600;">Past Due Tasks</h4>
                <span style="font-size: 11px; color: #64748b;">Action Required</span>
              </div>
              
              <div style="max-height: 400px; overflow-y: auto;">
                <div *ngIf="pastDueTasks.length === 0" style="padding: 30px; text-align: center; color: #64748b;">
                  <p style="font-size: 24px; margin: 0 0 10px 0;">🎉</p>
                  <p style="font-size: 12px; margin: 0;">No tasks crossed their deadline.</p>
                </div>

                <div
                  *ngFor="let t of pastDueTasks"
                  style="padding: 15px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.03); background: rgba(239, 68, 68, 0.03);"
                >
                  <div style="margin-bottom: 10px;">
                    <p style="margin: 0; font-size: 14px; font-weight: 500; color: #f8fafc;">{{ t.title }}</p>
                    <p style="margin: 4px 0 0 0; font-size: 11px; color: #f87171;">⏳ Deadline: {{ formatCreatedAt(t.deadline) }}</p>
                  </div>
                  
                  <div style="display: flex; gap: 8px;">
                    <button
                      (click)="handleExtendNotification(t)"
                      style="flex: 1; padding: 6px; background: #0ea5e9; border: none; border-radius: 8px; color: white; font-size: 11px; font-weight: 600; cursor: pointer;"
                    >
                      Extend
                    </button>
                    <button
                      (click)="removeTask(t.id!)"
                      style="padding: 6px 12px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; color: #ef4444; font-size: 11px; cursor: pointer;"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

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

      <div
        *ngIf="!isLoggedIn"
        style="flex: 1; display: flex; align-items: center; justify-content: center;"
      >
        <div
          style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); padding: 40px; border-radius: 32px; width: 100%; max-width: 400px; backdrop-filter: blur(20px); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);"
        >
          <h2
            style="text-align: center; margin-bottom: 30px; font-weight: 800; letter-spacing: -1px;"
          >
            {{ mode === 'login' ? 'Welcome Back' : 'Create Account' }}
          </h2>

          <div
            style="display: flex; gap: 10px; margin-bottom: 25px; background: rgba(0,0,0,0.2); padding: 5px; border-radius: 14px;"
          >
            <button
              (click)="mode = 'login'"
              [style.background]="
                mode === 'login' ? 'linear-gradient(135deg, #0ea5e9, #6366f1)' : 'transparent'
              "
              style="flex: 1; border: none; padding: 12px; border-radius: 10px; color: white; cursor: pointer; font-weight: 600; transition: 0.3s;"
            >
              Login
            </button>
            <button
              (click)="mode = 'register'"
              [style.background]="
                mode === 'register' ? 'linear-gradient(135deg, #0ea5e9, #6366f1)' : 'transparent'
              "
              style="flex: 1; border: none; padding: 12px; border-radius: 10px; color: white; cursor: pointer; font-weight: 600; transition: 0.3s;"
            >
              Register Account
            </button>
          </div>

          <input
            [(ngModel)]="userName"
            placeholder="Username"
            style="width: 100%; padding: 16px; margin-bottom: 15px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; color: white; outline: none; box-sizing: border-box;"
          />
          <input
            [(ngModel)]="password"
            type="password"
            (keyup.enter)="mode === 'login' ? doLogin() : doRegister()"
            placeholder="Password"
            style="width: 100%; padding: 16px; margin-bottom: 25px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; color: white; outline: none; box-sizing: border-box;"
          />

          <button
            (click)="mode === 'login' ? doLogin() : doRegister()"
            style="width: 100%; padding: 16px; background: linear-gradient(135deg, #0ea5e9, #6366f1); color: white; border: none; border-radius: 14px; font-weight: bold; cursor: pointer; font-size: 16px; box-shadow: 0 10px 20px rgba(14, 165, 233, 0.3);"
          >
            {{ mode === 'login' ? 'Sign In' : 'Create Account' }}
          </button>

          <p
            *ngIf="message"
            [style.color]="messageType === 'error' ? '#f87171' : '#4ade80'"
            style="font-size: 13px; margin-top: 20px; text-align: center;"
          >
            {{ message }}
          </p>
        </div>
      </div>

      <main
        *ngIf="isLoggedIn"
        style="display: grid; grid-template-columns: 1fr 2.5fr; gap: 30px; max-width: 1300px; margin: 0 auto; width: 100%;"
      >
        <section>
          <div
            style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1)); border: 1px solid rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 24px; text-align: center;"
          >
            <h3 style="margin: 0; color: #94a3b8; font-size: 14px;">Productivity Score</h3>
            <div
              style="font-size: 48px; font-weight: 800; margin: 15px 0; background: linear-gradient(to right, #0ea5e9, #6366f1); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
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
              placeholder="Enter task and press enter..."
              (keyup.enter)="saveTask()"
              style="flex: 1; padding: 16px 25px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; color: white; font-size: 16px; outline: none;"
            />
            <input
              type="datetime-local"
              [(ngModel)]="newTaskDeadline"
              [min]="minDateTime"
              style="padding: 16px 20px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; color: #94a3b8; font-size: 14px; outline: none; font-family: inherit;"
            />
            <button
              (click)="saveTask()"
              style="background: linear-gradient(135deg, #0ea5e9, #6366f1); color: white; border: none; padding: 0 25px; border-radius: 20px; font-weight: 600; cursor: pointer;"
            >
              Add Task
            </button>
          </div>

          <div 
            *ngIf="tasks.length > 0"
            style="margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; padding: 0 5px;"
          >
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 10px; height: 10px; background: #3b82f6; border-radius: 3px; box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);"></div>
              <span style="font-size: 13px; color: #94a3b8; font-weight: 500;">{{ tasks.length }} Tasks</span>
            </div>
            
            <button 
              (click)="toggleSort()"
              style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #f8fafc; padding: 8px 16px; border-radius: 14px; cursor: pointer; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 8px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); outline: none; backdrop-filter: blur(4px);"
              onmouseover="this.style.background='rgba(59, 130, 246, 0.1)'; this.style.borderColor='rgba(59, 130, 246, 0.3)'; this.style.transform='translateY(-1px)'"
              onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='rgba(255,255,255,0.1)'; this.style.transform='translateY(0)'"
            >
              <span style="font-size: 14px;">{{ sortByDeadline ? '⌛' : '🆕' }}</span>
              <span>Sorted by: {{ sortByDeadline ? 'Deadline' : 'Newest' }}</span>
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
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                  <input
                    type="datetime-local"
                    [(ngModel)]="editDeadline"
                    [min]="minDateTime"
                    style="flex: 1; background: #0f172a; border: 1px solid rgba(255,255,255,0.2); padding: 8px 12px; border-radius: 8px; color: #94a3b8; outline: none; font-size: 12px;"
                  />
                  <button
                    *ngIf="editDeadline"
                    (click)="clearEditDeadline()"
                    style="background: transparent; border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; padding: 0 10px; border-radius: 8px; font-size: 11px; cursor: pointer;"
                  >
                    Clear Deadline
                  </button>
                </div>
                <div style="display: flex; gap: 10px;">
                  <button
                    (click)="saveEdit()"
                    style="background: #0ea5e9; border: none; color: white; padding: 4px 12px; border-radius: 6px; font-size: 11px; cursor: pointer;"
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
                <div style="display: flex; align-items: center; gap: 15px; margin-top: 4px;">
                  <span style="font-size: 11px; color: #475569; display: flex; align-items: center; gap: 5px;">
                    🕒 Created: {{ formatCreatedAt(t.createdAt) }}
                  </span>
                  
                  <span
                    *ngIf="t.deadline"
                    [style.color]="isPastDue(t) ? '#f87171' : '#fbbf24'"
                    style="font-size: 11px; display: flex; align-items: center; gap: 5px; font-weight: 600;"
                  >
                    ⏳ Deadline: {{ formatCreatedAt(t.deadline) }}
                    <span *ngIf="isPastDue(t)">(Past Due)</span>
                  </span>
                </div>
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
    <style>
      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    </style>
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
  showNotifications: boolean = false;
  sortByDeadline: boolean = true;

  editingId: number | null = null;
  editTitle: string = '';
  editDeadline: string = '';

  newTaskDeadline: string = '';
  minDateTime: string = '';

  constructor(
    private service: TaskService,
    private auth: AuthService,
  ) { }

  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.loggedInUserName = this.auth.getUserName() ?? '';
    this.updateMinDateTime();

    // Periodically update minDateTime so it stays current
    setInterval(() => this.updateMinDateTime(), 60000);

    if (this.isLoggedIn) this.load();
  }

  updateMinDateTime() {
    const now = new Date();
    // Format required for datetime-local: YYYY-MM-DDThh:mm
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.minDateTime = now.toISOString().slice(0, 16);
  }

  get pastDueTasks() {
    return this.tasks.filter(t => this.isPastDue(t));
  }

  isPastDue(t: TodoTask): boolean {
    if (!t.deadline || t.isCompleted) return false;
    const deadlineDate = new Date(t.deadline);
    return deadlineDate.getTime() < new Date().getTime();
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  handleExtendNotification(t: TodoTask) {
    this.showNotifications = false;
    this.startEdit(t);
  }

  load() {
    this.service.getTasks().subscribe({
      next: (res) => {
        this.tasks = res;
        this.applySort();
      },
      error: () => console.error('Failed to load tasks'),
    });
  }

  toggleSort() {
    this.sortByDeadline = !this.sortByDeadline;
    this.applySort();
  }

  applySort() {
    if (this.sortByDeadline) {
      this.tasks.sort((a, b) => {
        // Tasks with deadlines first
        if (a.deadline && !b.deadline) return -1;
        if (!a.deadline && b.deadline) return 1;

        // If both have deadlines, sort by date ascending
        if (a.deadline && b.deadline) {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }

        // If neither have deadlines, sort by CreatedAt descending
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    } else {
      // Sort by CreatedAt descending
      this.tasks.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }
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
      error: (err) => {
        this.messageType = 'error';
        this.message = err?.error?.message || 'Invalid credentials';
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

    // Check if new task deadline is in the past natively as fallback
    if (this.newTaskDeadline && new Date(this.newTaskDeadline).getTime() < new Date().getTime()) {
      alert("Deadline must be in the future.");
      return;
    }

    const newTask: TodoTask = {
      title: this.newTaskTitle,
      isCompleted: false
    };

    if (this.newTaskDeadline) {
      // Create a date without the Z (to represent local time)
      const localDate = new Date(this.newTaskDeadline);
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, '0');
      const day = String(localDate.getDate()).padStart(2, '0');
      const hours = String(localDate.getHours()).padStart(2, '0');
      const minutes = String(localDate.getMinutes()).padStart(2, '0');
      const seconds = String(localDate.getSeconds()).padStart(2, '0');

      newTask.deadline = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }

    this.service.addTask(newTask).subscribe(() => {
      this.newTaskTitle = '';
      this.newTaskDeadline = '';
      this.load();
    });
  }

  startEdit(t: TodoTask) {
    if (!this.isLoggedIn) return;
    this.editingId = t.id ?? null;
    this.editTitle = t.title;

    if (t.deadline) {
      const d = new Date(t.deadline);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      this.editDeadline = `${year}-${month}-${day}T${hours}:${minutes}`;
    } else {
      this.editDeadline = '';
    }
  }

  clearEditDeadline() {
    this.editDeadline = '';
  }

  saveEdit() {
    if (this.editingId == null || !this.editTitle.trim()) {
      this.cancelEdit();
      return;
    }

    if (this.editDeadline && new Date(this.editDeadline).getTime() < new Date().getTime()) {
      alert("Deadline must be in the future.");
      return;
    }

    const task = this.tasks.find((t) => t.id === this.editingId);
    if (task) {
      const updatedTask = { ...task, title: this.editTitle };
      if (this.editDeadline) {
        const localDate = new Date(this.editDeadline);
        const year = localDate.getFullYear();
        const month = String(localDate.getMonth() + 1).padStart(2, '0');
        const day = String(localDate.getDate()).padStart(2, '0');
        const hours = String(localDate.getHours()).padStart(2, '0');
        const minutes = String(localDate.getMinutes()).padStart(2, '0');
        const seconds = String(localDate.getSeconds()).padStart(2, '0');

        updatedTask.deadline = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      } else {
        updatedTask.deadline = undefined; // clear deadline
      }

      this.service.updateTask(updatedTask).subscribe(() => {
        this.load();
        this.cancelEdit();
      });
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.editTitle = '';
    this.editDeadline = '';
  }

  toggleComplete(t: TodoTask) {
    this.service.updateTask({ ...t, isCompleted: !t.isCompleted }).subscribe(() => this.load());
  }

  removeTask(id: number) {
    this.service.deleteTask(id).subscribe(() => this.load());
  }

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
