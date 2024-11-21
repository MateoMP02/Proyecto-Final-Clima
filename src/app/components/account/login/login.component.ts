import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../../types/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Servicios
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);


  // Definición del formulario de login con validaciones
  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]], // Validación de correo electrónico
    password: ['', [Validators.required, Validators.minLength(4)]] // Validación de contraseña
  });

  // Mensaje de error que se mostrará en caso de fallos en el login
  errorMessage: string = '';

  // Ciudad de residencia opcional
  residenceCity?: string;

  // Historial de búsquedas opcional
  searchHistory?: string[];

  /**
   * Método que maneja el proceso de login
   * Verifica si el formulario es válido y luego realiza la autenticación con el AuthService
   */
  login() {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;

      const email = formValue.email!;
      const password = formValue.password!;

      // Llama al servicio de autenticación para iniciar sesión
      this.authService.login(email, password).subscribe({
        next: (user) => {
          if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            alert('Login successful');
            this.router.navigate(['/search']);
          } else {
            this.errorMessage = 'Incorrect email or password';
          }
        },
        error: () => {
          this.errorMessage = 'Error logging in. Please try again later.';
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields.';
    }
  }

}
