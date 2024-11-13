import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocationSearchComponent } from '../../components/location-search/location-search.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,CommonModule,LocationSearchComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  hideLocationSearch: boolean = false;
  authService = inject(AuthService);

  constructor(private router: Router) {
    // Escuchar eventos de navegación para actualizar la visibilidad del componente de búsqueda
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Ocultar el componente de búsqueda solo si la ruta es `/location-search`
        this.hideLocationSearch = ['/login', '/register', '/search'].some(route => event.url.includes(route));
      }
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
  }
}
