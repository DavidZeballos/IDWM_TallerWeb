import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const token = authService.getToken();
  const tokenExpiration = authService.getTokenExpiration();
  const currentTime = Math.floor(Date.now() / 1000);

  if (token && tokenExpiration && tokenExpiration > currentTime) {
    return true;
  }

  console.warn('AuthGuard - Token inválido o expirado. Redirigiendo al login.');
  router.navigate(['/auth/login']);
  return false;
};