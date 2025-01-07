import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  cartItemCount: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((authStatus: boolean) => {
      this.isAuthenticated = authStatus;
      if (authStatus) {
        const role = this.authService.getRole();
        this.isAdmin = role === 'Admin';
      } else {
        this.isAdmin = false;
      }
    });

    this.updateCartCount();

    // Escuchar eventos globales para actualizar el contador del carrito
    window.addEventListener('cartUpdated', () => {
      this.updateCartCount();
    });
  }

  updateCartCount(): void {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartItemCount = cart.reduce((total: number, item: any) => total + item.quantity, 0);
  }

  logout(): void {
    this.authService.logout();
    this.toastr.info('Sesión cerrada exitosamente.', 'Información');
    this.router.navigate(['/auth/login']);
  }
}
