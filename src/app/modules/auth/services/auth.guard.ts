import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanMatchFn,
} from '@angular/router';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

export const AutentificacionGuard: CanMatchFn = () => {
  const tokenValido = inject(TokenService).validarToken();
  const router = inject(Router);

  if (tokenValido) {
    const existeCookieEmpresa = localStorage.getItem('SeleccionarEmpresa');

    if (existeCookieEmpresa === 'false') {
      return false
    }else {
      return true
    }
  }

  return true;
};



// @Injectable({ providedIn: 'root' })
// export class AuthGuard implements CanActivate {

//   const tokenValido = inject(TokenService).validarToken();
//   const router = inject(Router);

//   constructor(private authService: AuthService) {}

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
//     const currentUser = this.authService.currentUserValue;
//     if (currentUser) {
//       // logged in so return true
//       return true;
//     }

//     // not logged in so redirect to login page with the return url
//     this.authService.logout();
//     return false;
//   }
//}
