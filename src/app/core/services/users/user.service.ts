import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../app.config';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/Client`;

  constructor(private http: HttpClient) {}

  // Obtener perfil del usuario autenticado
  getProfile(): Observable<any> {
    console.log('[UserService] Iniciando solicitud para obtener el perfil...');
    return this.http.get(`${this.apiUrl}/profile`).pipe(
      tap((profile) => {
        console.log('[UserService] Perfil cargado exitosamente:', profile);
      }),
      catchError((error) => {
        console.error('[UserService] Error al obtener el perfil:', error);
        return throwError(() => new Error('Error al obtener el perfil del usuario.'));
      })
    );
  }

  // Actualizar perfil del usuario
  updateProfile(data: { name: string; dateOfBirth: string; gender: string }): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Account/EditProfile`, data, { responseType: 'text' }).pipe(
      tap(() => console.log('Perfil actualizado exitosamente')),
      catchError(this.handleError)
    );
  }

  // Cambiar contraseña
  changePassword(data: { currentPassword: string; newPassword: string; confirmPassword: string }): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Account/ChangePassword`, data, { responseType: 'text' }).pipe(
      tap(() => console.log('Contraseña cambiada exitosamente')),
      catchError(this.handleError)
    );
  }

  // Listar usuarios con filtros opcionales (solo para admin)
  getUsers(filters: { id?: number; page?: number; pageSize?: number; name?: string; status?: boolean }): Observable<any> {
    let params = new HttpParams();
    if (filters.id) params = params.append('id', filters.id.toString());
    if (filters.page) params = params.append('page', filters.page.toString());
    if (filters.pageSize) params = params.append('pageSize', filters.pageSize.toString());
    if (filters.name) params = params.append('name', filters.name);
    if (filters.status !== undefined) params = params.append('status', filters.status.toString());
  
    return this.http.get(this.apiUrl, { params }).pipe(
      tap((users) => console.log('Usuarios cargados:', users)),
      catchError(this.handleError)
    );
  }

  // Cambiar estado del usuario (solo para admin)
  changeUserStatus(userId: string, status: boolean): Observable<any> {
    const url = `${this.apiUrl}/${userId}/status`;
    return this.http.put(url, { status }, { responseType: 'text' }).pipe(
      tap(() => console.log(`Estado del usuario con ID ${userId} actualizado a ${status}`)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en el servicio UserService:', error);
    return throwError(() => new Error('Error en el servicio de usuarios.'));
  }
}
