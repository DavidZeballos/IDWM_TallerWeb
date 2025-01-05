import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../app.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<string> {
    return this.http.post<string>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      map((token: string) => {
        localStorage.setItem('token', token);
        this.isAuthenticatedSubject.next(true);
        return token;
      })
    );
  }

  register(data: any): Observable<string> {
    return this.http.post<string>(`${environment.apiUrl}/auth/register`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.isAuthenticatedSubject.next(false);
  }

  getUsername(): string {
    return localStorage.getItem('username') || '';
  }
}
