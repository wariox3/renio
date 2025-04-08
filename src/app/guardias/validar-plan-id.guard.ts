import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AlertaService } from '@comun/services/alerta.service';
import { Store } from '@ngrx/store';
import { obtenerContenedorPlanId } from '@redux/selectors/contenedor.selectors';
import { obtenerMenuModulos } from '@redux/selectors/menu.selectors';
import { switchMap, tap } from 'rxjs';

export const ValidarPlanIdGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const alerta = inject(AlertaService);
  let persimsos = true;

  store
    .select(obtenerContenedorPlanId)
    .pipe(
      switchMap((plan_id) => store.select(obtenerMenuModulos(plan_id))),
      tap((modulos) => {
        let url = route.routeConfig?.path;
        persimsos = modulos.includes(url!.toLocaleUpperCase());
      })
    )
    .subscribe();

  if (!persimsos) {
    router.navigate(['/general']);
    setTimeout(() => {
      alerta.mensajeError(
        'Error',
        'Su plan actual no cuenta con este módulo'
      );
    }, 1000);
  }

  return persimsos;
};
