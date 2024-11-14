import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  router = inject(Router)
  authService = inject(AuthService);

  registerForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    email: ['', [Validators.required, Validators.email]],
    residenceCity:['',[Validators.minLength(3)]] //No es requerido
  })



  username: string = '';
  password: string = '';
  residenceCity: string = '';
  errorMessage: string = '';
  email: string = '';

  
  register() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      const username = formValue.username!;
      const password = formValue.password!;
      const email = formValue.email!; 

      this.authService.register({
        username: username,
        password: password,
        email: email,
        residenceCity: formValue.residenceCity,
        searchHistory: []
      }).subscribe({
        next: () =>{ alert('Registration successful')
          this.router.navigate(['/search'])
      },
        error: (err) => {
          if (err.message === 'This email is already registered.') {
            alert('This email is already registered. Please use a different one.') 
          } 
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields.';
    }
  }
}
