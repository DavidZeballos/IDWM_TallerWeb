import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth-routing.module').then(
        (m) => m.AuthRoutingModule
      ),
  },
  {
    path: 'profile/edit',
    loadComponent: () =>
      import('./features/profile/edit-profile/edit-profile.component').then(
        (m) => m.EditProfileComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'profile/change-password',
    loadComponent: () =>
      import('./features/profile/change-password/change-password.component').then(
        (m) => m.ChangePasswordComponent
      ),
    canActivate: [authGuard],
  },
  // Vista de productos para usuarios normales
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/product-list/product-list.component').then(
        (m) => m.ProductListComponent
      ),
    canActivate: [authGuard],
  },
  // Carrito
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart.component').then((m) => m.CartComponent),
  },
  // Vistas de administración protegidas
  {
    path: 'admin/products/list',
    loadComponent: () =>
      import('./features/admin/products/product-list/product-list.component').then(
        (m) => m.ProductListComponent
      ),
    canActivate: [adminGuard],
  },
  {
    path: 'admin/products/create',
    loadComponent: () =>
      import('./features/admin/products/create-product/create-product.component').then(
        (m) => m.CreateProductComponent
      ),
    canActivate: [adminGuard],
  },
  {
    path: 'admin/products/edit/:id',
    loadComponent: () =>
      import('./features/admin/products/edit-product/edit-product.component').then(
        (m) => m.EditProductComponent
      ),
    canActivate: [adminGuard],
  },
  {
    path: 'admin/users/list',
    loadComponent: () =>
      import('./features/admin/users/user-list/user-list.component').then(
        (m) => m.UserListComponent
      ),
    canActivate: [adminGuard],
  },
  { path: '**', redirectTo: '' },
];
