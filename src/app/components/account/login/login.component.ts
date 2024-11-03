import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
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

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  })

  username: string = '';
  password: string = '';
  errorMessage: string = '';
  residenceCity?: string;
  searchHistory?: string[];

  constructor(private usersService: UsersService) {}

  login(): void {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;

      const username = formValue.username!;
      const password = formValue.password!;

      this.usersService.login(username, password).subscribe({
        next: (user: User | null) => {
          if (user) {
            alert('Login successful');
            this.router.navigate(['/search'])
          } else {
            this.errorMessage = 'Invalid username or password';
          }
        },
        error: (err) => {
          this.errorMessage = 'Login failed. Please try again later.';
          console.error('Login error:', err);
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields.';
    }
  }
}
