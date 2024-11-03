import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isLoggedIn: boolean = false;

  toggleLogin() {
    this.isLoggedIn = !this.isLoggedIn; 
  }

  login() {
    this.isLoggedIn = true; // Aca habria que autenticar 
  }

  logout() {
    this.isLoggedIn = false; // Aca habria que autenticar
  }
}
