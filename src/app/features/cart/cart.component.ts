import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../app.config';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  imports: [CommonModule], // Importar CommonModule
})
export class CartComponent implements OnInit {
  cart: any[] = [];
  total: number = 0;
  isAuthenticated: boolean = true; // Simulación de autenticación
  private checkoutUrl = `${environment.apiUrl}/Purchase/cart/checkout`;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cart = cart;
    this.calculateTotal();
  }

  incrementQuantity(index: number): void {
    this.cart[index].quantity += 1;
    this.updateCart();
  }

  decrementQuantity(index: number): void {
    if (this.cart[index].quantity > 1) {
      this.cart[index].quantity -= 1;
      this.updateCart();
    }
  }

  removeItem(index: number): void {
    this.cart.splice(index, 1);
    this.updateCart();
  }

  calculateTotal(): void {
    this.total = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  updateCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.calculateTotal();
  }

  checkout(): void {
    const body = { items: this.cart };
  
    this.http.post(this.checkoutUrl, body).subscribe({
      next: () => {
        this.toastr.success('Compra realizada con éxito.');
        this.cart = [];
        this.updateCart();
      },
      error: (err) => {
        console.error('Error en el checkout:', err);
        this.toastr.error('Error al realizar el checkout: ' + err.message);
      },
    });
  }
}
