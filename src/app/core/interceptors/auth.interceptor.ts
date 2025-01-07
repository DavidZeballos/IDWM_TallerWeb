import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);

  console.log('[AuthInterceptor] Interceptando solicitud a:', req.url);

  // Ignorar solicitudes no protegidas
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    console.log('[AuthInterceptor] Solicitud no protegida, pasando sin modificar.');
    return next(req);
  }

  return authService.token$.pipe(
    take(1), // Tomar el valor más reciente del token.
    switchMap((token) => {
      if (token) {
        console.log('[AuthInterceptor] Token encontrado, añadiendo encabezado Authorization.');
        console.log('[AuthInterceptor] Token:', token);

        const modifiedRequest = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('[AuthInterceptor] Solicitud modificada con encabezado:', modifiedRequest);
        return next(modifiedRequest);
      } else {
        console.warn('[AuthInterceptor] No se encontró un token, enviando solicitud sin encabezado Authorization.');
        return next(req);
      }
    })
  );
};
