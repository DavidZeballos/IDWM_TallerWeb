import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

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
    path: 'profile',
    loadChildren: () =>
      import('./features/profile/profile-routing.module').then(
        (m) => m.ProfileRoutingModule
      ),
    canActivate: [authGuard],
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./features/products/products.module').then((m) => m.ProductsModule),
  },
  { path: '**', redirectTo: '' },
];
