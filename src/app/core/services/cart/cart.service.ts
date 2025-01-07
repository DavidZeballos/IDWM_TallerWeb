import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../app.config';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = `${environment.apiUrl}/Purchase/cart`;

  constructor(private http: HttpClient) {}

  getCart(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  addItem(productId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, { productId, quantity });
  }

  updateItem(productId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, { productId, quantity });
  }

  removeItem(productId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/remove/${productId}`);
  }

  checkout(data: { items: any[] }): Observable<any> {
    return this.http.post(`${this.baseUrl}/checkout`, data);
  }
}
