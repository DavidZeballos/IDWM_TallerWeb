import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/users/user.service';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
})
export class EditProfileComponent {
  profileForm: FormGroup;
  isEditing: { [key: string]: boolean } = {
    name: false,
    dateOfBirth: false,
    gender: false,
  };

  constructor(
    private fb: FormBuilder, 
    private userService: UserService, 
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      name: [''],
      dateOfBirth: [''],
      gender: [''],
    });

    this.loadProfile();
  }

  loadProfile(): void {
    const userId = this.authService.getId(); // Extraer la ID del JWT almacenado
    if (userId) {
      this.userService.getProfile(userId).subscribe({
        next: (profile: any) => {
          if (profile && profile.length > 0) {
            const userData = profile[0];
            console.log('Perfil cargado desde el servidor:', userData);
  
            // Actualizar el formulario con los datos obtenidos
            this.profileForm.patchValue({
              name: userData.userName,
              dateOfBirth: userData.dateOfBirth.split('T')[0],
              gender: userData.gender,
            });
          } else {
            console.error('No se encontraron datos de perfil.');
          }
        },
        error: (err) => console.error('Error al cargar perfil:', err),
      });
    } else {
      console.error('No se encontró un ID de usuario en el JWT.');
    }
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
  
    if (updatedData.name && updatedData.dateOfBirth && updatedData.gender) {
      this.userService.updateProfile(updatedData).subscribe({
        next: () => {
          console.log(`${field} actualizado correctamente`);
          // Actualizar los datos locales si es necesario
          localStorage.setItem('userName', updatedData.name);
          localStorage.setItem('dateOfBirth', updatedData.dateOfBirth);
          localStorage.setItem('gender', updatedData.gender);
        },
        error: (err) => console.error(`Error al actualizar ${field}:`, err),
      });
    } else {
      console.error('Faltan datos obligatorios para la actualización.');
    }
  }
}
