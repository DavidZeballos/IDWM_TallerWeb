import { Component } from '@angular/core';
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
export class NavbarComponent {
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((authStatus: boolean) => {
      this.isAuthenticated = authStatus;
    });
  }

  logout(): void {
    this.authService.logout();
    this.toastr.info('Sesión cerrada exitosamente.', 'Información');
    this.router.navigate(['/auth/login']);
  }
}
