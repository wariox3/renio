import { inject } from '@angular/core';
import { Router, CanMatchFn } from '@angular/router';
import { TokenService } from '@modulos/auth/services/token.service';

export const AutentificacionGuard: CanMatchFn = () => {
  const tokenValido = inject(TokenService).validarToken();

  const router = inject(Router);

  if (tokenValido) {
    return true;
  }

  //redirect a la landing page
  router.navigate(['/inicio']);
  return false;
};
