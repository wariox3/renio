import { inject } from '@angular/core';
import {
  Router,
  CanMatchFn,
} from '@angular/router';
import { TokenService } from '@modulos/auth/services/token.service';

export const AutentificacionGuard: CanMatchFn = () => {
  const tokenValido = inject(TokenService).validarToken();
  const router = inject(Router);

  if (tokenValido) {
    const existeCookieEmpresa = localStorage.getItem('SeleccionarEmpresa');
    if (existeCookieEmpresa === 'false') {
      router.navigate(['/auth/login'])
      return false
    }else {
      return true
    }
  }

  router.navigate(['/auth/login'])
  return false;
};
