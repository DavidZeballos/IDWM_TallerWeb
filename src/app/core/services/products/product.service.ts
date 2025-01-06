import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../app.config';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/Product`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap((products) => console.log('Productos cargados:', products)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error al cargar los productos:', error);
        return throwError(() => new Error('Error al cargar los productos.'));
      })
    );
  }
}
