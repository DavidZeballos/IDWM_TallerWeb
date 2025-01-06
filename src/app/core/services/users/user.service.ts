import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../app.config';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getProfile(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Client?id=${userId}`).pipe(
      tap((profile) => console.log('Perfil cargado:', profile)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error al cargar el perfil:', error);
        return throwError(() => new Error('Error al cargar el perfil.'));
      })
    );
  }

  updateProfile(data: { name: string; dateOfBirth: string; gender: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/Account/EditProfile`, data, { responseType: 'text' }).pipe(
      tap(() => console.log('Perfil actualizado exitosamente')),
      catchError((error: HttpErrorResponse) => {
        console.error('Error al actualizar el perfil:', error);
        return throwError(() => new Error('Error al actualizar el perfil.'));
      })
    );
  }

  changePassword(data: { currentPassword: string; newPassword: string; confirmPassword: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/Account/ChangePassword`, data, { responseType: 'text' }).pipe(
      tap(() => console.log('Contraseña cambiada exitosamente')),
      catchError((error: HttpErrorResponse) => {
        console.error('Error al cambiar la contraseña:', error);
        return throwError(() => new Error('Error al cambiar la contraseña.'));
      })
    );
  }
}
