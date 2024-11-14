import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../../types/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  fb = inject(FormBuilder);
  router = inject(Router)
  authService = inject(AuthService);

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  })

  username: string = '';
  password: string = '';
  errorMessage: string = '';
  residenceCity?: string;
  searchHistory?: string[];

  login() {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;

      const username = formValue.username!;
      const password = formValue.password!;

      this.authService.login(username, password).subscribe({
        next: (user) => {
          if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            alert('Login successful');
            this.router.navigate(['/search']); // Redirige a la página principal
          } else {
            this.errorMessage = 'Invalid username or password';
          }
        },
        error: () => {
          this.errorMessage = 'Login failed. Please try again later.';
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields.';
    }
  }
}
