import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';

export interface LoginResponse {
  token: string;
  userName: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5112/api/auth';
  private tokenKey = 'tt_token';
  private userNameKey = 'tt_userName';

  userName$ = new BehaviorSubject<string | null>(this.getUserName());

  constructor(private http: HttpClient) {}

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserName(): string | null {
    return localStorage.getItem(this.userNameKey);
  }

  register(userName: string, password: string): Observable<void> {
    return this.http
      .post(`${this.apiUrl}/register`, { userName, password })
      .pipe(map(() => void 0));
  }

  login(userName: string, password: string): Observable<void> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { userName, password }).pipe(
      tap((res) => {
        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem(this.userNameKey, res.userName);
        this.userName$.next(res.userName);
      }),
      map(() => void 0)
    );
  }

  logout(): Observable<void> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      catchError(() => of(void 0)),
      tap(() => {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userNameKey);
        this.userName$.next(null);
      }),
      map(() => void 0)
    );
  }
}

