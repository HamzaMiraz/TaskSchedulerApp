import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// This matches your C# 'TodoTask' model
export interface TodoTask {
  id?: number;
  title: string;
  isCompleted: boolean;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  // Your Backend Port is 5112
  private apiUrl = 'http://localhost:5112/api/tasks';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<TodoTask[]> {
    return this.http.get<TodoTask[]>(this.apiUrl);
  }

  getTask(id: number): Observable<TodoTask> {
    return this.http.get<TodoTask>(`${this.apiUrl}/${id}`);
  }

  addTask(task: TodoTask): Observable<TodoTask> {
    return this.http.post<TodoTask>(this.apiUrl, task);
  }

  updateTask(task: TodoTask): Observable<TodoTask> {
    return this.http.put<TodoTask>(`${this.apiUrl}/${task.id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
