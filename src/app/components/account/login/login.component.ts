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
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });
  
  errorMessage: string = '';
  residenceCity?: string;
  searchHistory?: string[];
  
 // Metodo login
login() {
  if (this.loginForm.valid) {
    const formValue = this.loginForm.value;

    const email = formValue.email!;
    const password = formValue.password!;

    this.authService.login(email, password).subscribe({
      next: (user) => {
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          alert('Login successful');
          this.router.navigate(['/search']); // redirecciona a la pagina principal
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
