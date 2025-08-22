import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AlertaService } from '@comun/services/alerta.service';
import { obtenerContenedorRol } from '@redux/selectors/contenedor.selectors';
import { map, take } from 'rxjs/operators';

export const propietarioGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const alertaService = inject(AlertaService);
  
  // Verificar si el usuario tiene el rol de propietario usando el selector de Redux
  return store.select(obtenerContenedorRol).pipe(
    take(1),
    map(rol => {
      if (rol === 'propietario') {
        return true;
      }
      
      // Si no es propietario, mostrar mensaje y redirigir
      // alertaService.mensajeError('Acceso denegado', 'No tienes permisos para acceder a esta sección');
      router.navigate(['/']);
      return false;
    })
  );
};
