import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;

  /**
   * Aquí guardaremos los errores que vengan del backend.
   * Ejemplo: { Email: ["Este email ya está en uso"], Rut: ["RUT inválido"] }
   */
  serverErrors: Record<string, string[]> = {};

  /**
   * Mapeo entre nombres de controles del formulario y nombres de campos del backend.
   * Esto es necesario si el backend usa una capitalización diferente.
   */
  private fieldMapping: Record<string, string> = {
    userName: 'UserName',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'ConfirmPassword',
    rut: 'Rut',
    dateOfBirth: 'DateOfBirth',
    gender: 'Gender'
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      /**
       * NOMBRE DE USUARIO:
       * - Requerido
       * - Solo letras (incluyendo acentos y ñ) y espacios
       * - Mínimo 8, máximo 255 caracteres
       */
      userName: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{8,255}$/),
        ],
      ],

      /**
       * EMAIL:
       * - Requerido
       * - Formato de email
       * (La unicidad se valida en el servidor)
       */
      email: ['', [Validators.required, Validators.email]],

      /**
       * PASSWORD:
       * - Requerido
       * - Alfanumérico (mín 8, máx 20)
       */
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/),
        ],
      ],
      confirmPassword: ['', [Validators.required]],

      /**
       * RUT:
       * - Requerido
       * - Patrón local (un ejemplo simplificado)
       * (La unicidad se valida en el servidor)
       */
      rut: ['', [Validators.required, this.rutValidator]],

      /**
       * FECHA DE NACIMIENTO:
       * - Requerida
       * - Debe ser anterior a la fecha actual
       */
      dateOfBirth: ['', [Validators.required, this.dateValidator]],

      /**
       * GÉNERO:
       * - Requerido
       * - Seleccionable de una lista
       */
      gender: ['', [Validators.required]],
    });
  }

  /**
   * Valida el RUT de manera básica (sin dígito verificador sofisticado).
   * Ajusta según tu lógica real si deseas algo más estricto.
   */
  rutValidator(control: AbstractControl) {
    const value = control.value || '';
    const cleanRut = value.replace(/\./g, '').replace('-', '');

    // Ejemplo: mínimo 7 dígitos, máximo 8, más 1 dígito verificador (0-9kK).
    if (!/^\d{7,8}[0-9kK]$/.test(cleanRut)) {
      return { invalidRut: true };
    }

    return null;
  }

  /**
   * Da formato al RUT al perder el foco (opcional).
   */
  formatRut(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    const cleanRut = input.replace(/\./g, '').replace('-', '');
    if (cleanRut.length < 2) return;

    const rutBody = cleanRut.slice(0, -1);
    const verifier = cleanRut.slice(-1);
    const formatted = `${rutBody.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${verifier}`;
    this.registerForm.patchValue({ rut: formatted });
  }

  /**
   * Valida que la fecha sea anterior al día de hoy.
   */
  dateValidator(control: AbstractControl) {
    const inputDate = new Date(control.value);
    const currentDate = new Date();
    if (isNaN(inputDate.getTime()) || inputDate >= currentDate) {
      return { invalidDate: true };
    }
    return null;
  }

  /**
   * Combina las validaciones locales (front) con los errores del backend.
   * Retorna un array de strings con TODOS los errores para ese campo.
   */
  getErrorMessagesForField(fieldName: string): string[] {
    const messages: string[] = [];

    // 1) Errores del front
    const control = this.registerForm.get(fieldName);
    if (control && (control.touched || control.dirty) && control.errors) {
      if (control.errors['required']) {
        messages.push('Este campo es obligatorio.');
      }
      if (control.errors['pattern']) {
        // Personalizar según el campo
        switch (fieldName) {
          case 'userName':
            messages.push('Debe contener solo letras en español (mín. 8, máx. 255).');
            break;
          case 'password':
            messages.push('La contraseña debe ser alfanumérica y tener entre 8 y 20 caracteres.');
            break;
          default:
            messages.push('El formato de este campo es inválido.');
            break;
        }
      }
      if (control.errors['invalidRut']) {
        messages.push('El RUT no es válido.');
      }
      if (control.errors['invalidDate']) {
        messages.push('La fecha debe ser anterior a la fecha actual.');
      }
      if (control.errors['email']) {
        messages.push('El correo electrónico no es válido.');
      }
      if (control.errors['minlength']) {
        const requiredLength = control.errors['minlength'].requiredLength;
        messages.push(`Debe tener al menos ${requiredLength} caracteres.`);
      }
    }

    // 2) Errores del backend (si los hubiera)
    const serverFieldName = this.fieldMapping[fieldName];
    if (this.serverErrors[serverFieldName]) {
      messages.push(...this.serverErrors[serverFieldName]);
    }

    return messages;
  }

  /**
   * Al hacer submit, primero verificamos validaciones de front.
   * Si todo está OK, llamamos al backend. Si hay error del backend,
   * parseamos y asignamos los errores correspondientes.
   */
  onSubmit(): void {
    // Limpia los errores previos del backend cada vez que enviamos
    this.serverErrors = {};

    // Validación final de contraseñas
    const formValue = this.registerForm.value;
    if (formValue.password !== formValue.confirmPassword) {
      this.toastr.error('Las contraseñas no coinciden.', 'Error');
      return;
    }

    // Si el formulario es inválido, marcamos todos los campos como tocados para mostrar errores
    if (this.registerForm.invalid) {
      this.toastr.error('Por favor, verifica los campos marcados en rojo.', 'Error');
      this.registerForm.markAllAsTouched();
      return;
    }

    // Formulario válido -> hacemos el request
    this.authService.register(formValue).subscribe({
      next: () => {
        this.toastr.success('Registro exitoso. Redirigiendo al login...', 'Éxito');
        this.router.navigate(['/auth/login']);
      },
      error: (err: any) => {
        console.error('Error al registrar:', err);

        // Intentamos parsear si llega como string
        let errorObj: any = null;
        if (typeof err.error === 'string') {
          try {
            errorObj = JSON.parse(err.error);
          } catch (parseError) {
            console.warn('No se pudo parsear el error JSON:', parseError);
          }
        } else if (typeof err.error === 'object') {
          errorObj = err.error;
        }

        // Si tenemos un objeto con `errors`, los asignamos
        // (p. ej. { Email: ["Ya existe un usuario con este Email"], ... })
        if (errorObj?.errors) {
          this.serverErrors = errorObj.errors;
          // Marcar todos los campos como tocados para mostrar errores
          this.registerForm.markAllAsTouched();
        }

        // Si el servidor envía un mensaje general (sin fields), lo mostramos en toast
        if (errorObj?.message) {
          this.toastr.error(errorObj.message, 'Error');
        } else if (errorObj?.errors) {
          // Opcional: Puedes decidir si mostrar un mensaje genérico si hay errores de campo
          this.toastr.error('Por favor, corrige los errores en el formulario.', 'Error');
        } else {
          // Mensaje fallback
          this.toastr.error('No se pudo completar el registro. Intente nuevamente.', 'Error');
        }
      },
    });
  }
}
