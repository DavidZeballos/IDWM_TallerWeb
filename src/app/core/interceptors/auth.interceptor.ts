import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const token = localStorage.getItem('token');
  console.log('Token en interceptor antes de procesar solicitud:', token);

  let modifiedRequest = req;
  if (token) {
    modifiedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  } else {
    console.warn('No se encontró un token para esta solicitud.');
  }

  return next(modifiedRequest);
};
