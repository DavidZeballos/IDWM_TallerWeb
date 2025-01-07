import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/users/user.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing: { [key: string]: boolean } = {
    name: false,
    dateOfBirth: false,
    gender: false,
  };

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.profileForm = this.fb.group({
      name: [{ value: '', disabled: true }],
      dateOfBirth: [{ value: '', disabled: true }],
      gender: [{ value: '', disabled: true }],
    });
  }

  ngOnInit(): void {
    if (!this.authService.getToken()) {
      this.toastr.warning('Debes iniciar sesión primero.');
      this.router.navigate(['/auth/login']);
      return;
    }
    this.loadProfile();
  }

  loadProfile(): void {
    this.userService.getProfile().subscribe({
      next: (profile: any) => {
        console.log('Datos del perfil:', profile);
        this.profileForm.patchValue({
          name: profile.userName,
          dateOfBirth: profile.dateOfBirth?.split('T')[0],
          gender: profile.gender,
        });
      },
      error: (err) => {
        console.error('Error al cargar el perfil:', err);
        this.toastr.error('Error al cargar el perfil.', 'Error');
      },
    });
  }

  enableEdit(field: string): void {
    this.isEditing[field] = true;
    this.profileForm.get(field)?.enable();
  }

  saveField(field: string): void {
    this.isEditing[field] = false;
    this.profileForm.get(field)?.disable();

    const updatedData = {
      name: this.profileForm.get('name')?.value,
      dateOfBirth: this.profileForm.get('dateOfBirth')?.value,
      gender: this.profileForm.get('gender')?.value,
    };

    this.userService.updateProfile(updatedData).subscribe({
      next: () => {
        this.toastr.success(`${field} actualizado correctamente`);
      },
      error: (err) => {
        console.error(`Error al actualizar ${field}:`, err);
        this.toastr.error(`Error al actualizar ${field}`, 'Error');
      },
    });
  }
}
