import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  
  const router = inject(Router);  

  //Si no esta logeado lo envia a login
  if (authService.isLoggedIn()) {
    return true;  
  } else {
    router.navigate(['/login']);  
    return false;  
  }
};