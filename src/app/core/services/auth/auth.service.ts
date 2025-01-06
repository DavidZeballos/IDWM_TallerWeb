import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../app.config';

interface DecodedToken {
  sub: string;
  email: string;
  Id: string; // ID del usuario
  role: string;
  DateOfBirth?: string; // Fecha de nacimiento opcional
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<string> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { responseType: 'text' }).pipe(
      tap((token: string) => {
        console.log('Respuesta del servidor (texto del token):', token);
        if (token) {
          localStorage.setItem('token', token);
          this.isAuthenticatedSubject.next(true);

          const decoded: DecodedToken = jwtDecode(token);
          console.log('Token decodificado:', decoded);
          localStorage.setItem('id', decoded.Id);
          if (decoded.DateOfBirth) {
            localStorage.setItem('dateOfBirth', decoded.DateOfBirth);
          }
          console.log('ID almacenado correctamente:', decoded.Id);
          console.log('Fecha de nacimiento almacenada:', decoded.DateOfBirth);
        }
      })
    );
  }

  register(data: {
    email: string;
    password: string;
    confirmPassword: string;
    userName: string;
    rut: string;
    dateOfBirth: string;
    gender: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data, { responseType: 'text' });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getId(): string | null {
    return localStorage.getItem('id');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('dateOfBirth');
    this.isAuthenticatedSubject.next(false);
  }
}
