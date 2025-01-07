import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../app.config';

interface DecodedToken {
  sub: string;
  email: string;
  Id: string;
  role: string;
  DateOfBirth?: string;
  exp?: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  token$ = this.tokenSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<string> {
    console.log('Iniciando sesión...');
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        const token = response.token;
        console.log('Token recibido:', token);
  
        if (!token) {
          console.error('El servidor no devolvió un token válido.');
          throw new Error('No se recibió un token válido.');
        }
  
        localStorage.setItem('token', token);
        this.tokenSubject.next(token); // Emitir el nuevo token.
        console.log('Token almacenado en localStorage.');
  
        const decoded: DecodedToken = jwtDecode(token);
        console.log('Token decodificado:', decoded);
  
        localStorage.setItem('id', decoded.Id || '');
        localStorage.setItem('role', decoded.role || 'User');
        if (decoded.exp) {
          localStorage.setItem('exp', decoded.exp.toString());
        }
  
        console.log('Información almacenada en localStorage:', { decoded });
        this.isAuthenticatedSubject.next(true);
      }),
      // Mapea el Observable para retornar solo el token como un string
      map((response) => response.token)
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

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getTokenExpiration(): number | null {
    const exp = localStorage.getItem('exp');
    return exp ? parseInt(exp, 10) : null;
  }

  logout(): void {
    localStorage.clear();
    this.tokenSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }
}
