import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  // Servicios 
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  // Definición del formulario de registro con validaciones
  registerForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(4)]], // Validación para el nombre de usuario
    password: ['', [Validators.required, Validators.minLength(4)]], // Validación para la contraseña
    email: ['', [Validators.required, Validators.email]], // Validación para el correo electrónico
    residenceCity: ['', [Validators.minLength(3)]] // Ciudad de residencia (no obligatorio)
  });

  // Variables para almacenar la información del formulario
  username: string = '';
  password: string = '';
  residenceCity: string = '';
  errorMessage: string = '';
  email: string = '';

  /**
   * Método que maneja el proceso de registro
   * Verifica si el formulario es válido y luego realiza el registro con el AuthService
   */
  register() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      // Extrae los valores del formulario
      const username = formValue.username!;
      const password = formValue.password!;
      const email = formValue.email!;

      // Llama al servicio de autenticación para registrar al usuario
      this.authService.register({
        username: username,
        password: password,
        email: email,
        residenceCity: formValue.residenceCity,
        searchHistory: [] // Inicializa el historial de búsqueda vacío
      }).subscribe({
        next: () => {
          alert('Registration successful'); // Muestra mensaje de éxito
          this.router.navigate(['/login']); // Redirige al login
        },
        error: (err) => {
          // Muestra mensaje de error si el correo ya está registrado
          if (err.message === 'This email is already registered.') {
            alert('This email is already registered. Please use a different one.');
          }
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields.'; // Muestra error si el formulario es inválido
    }
  }

}
