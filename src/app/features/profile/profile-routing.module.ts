import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { authGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'edit',
    component: EditProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'change-password',
    loadComponent: () =>
      import('./change-password/change-password.component').then(
        (m) => m.ChangePasswordComponent
      ),
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
