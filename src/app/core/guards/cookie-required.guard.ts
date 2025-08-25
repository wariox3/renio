import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieGuardService } from './cookie-guard.service';
import { AlertaService } from '@comun/services/alerta.service';

/**
 * Guard que verifica la existencia de cookies requeridas para la aplicación
 * Si alguna cookie requerida no existe, redirige al login
 */
export const cookieRequiredGuard: CanActivateFn = (route, state) => {
  const cookieGuardService = inject(CookieGuardService);
  const router = inject(Router);
  const alertaService = inject(AlertaService);

  if (cookieGuardService.verificarCookiesRequeridas()) {
    return true;
  }
  
  // Si no tiene las cookies requeridas, redirigir al login
  alertaService.mensajeError('Error', 'La sesión ha expirado');
  return router.createUrlTree(['/auth/login']);
};
