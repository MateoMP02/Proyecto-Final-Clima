import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica si el usuario está logeado
  if (authService.isLoggedIn()) {
    return true;  // Permite el acceso
  } else {
    router.navigate(['/login']);  // Redirige al login si no está logeado
    return false;  // Bloquea el acceso
  }

};
