import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  console.log('Token en AuthGuard:', token);

  if (token) {
    return true;
  }

  console.warn('Token no encontrado en AuthGuard. Redirigiendo al login.');
  router.navigate(['/auth/login']);
  return false;
};
