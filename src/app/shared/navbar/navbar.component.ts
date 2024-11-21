import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  // Variable que controla si la búsqueda de ubicación está oculta
  hideLocationSearch: boolean = false;

  // Servicio de autenticación inyectado
  private authService = inject(AuthService);

  // Método para verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn(); // Llama al servicio de autenticación para verificar si el usuario está logueado
  }

  // Método para cerrar sesión
  logout(): void {
    this.authService.logout(); // Llama al servicio para cerrar sesión
    alert('You have successfully logged out.'); // Muestra una alerta de éxito al cerrar sesión
  }

}
