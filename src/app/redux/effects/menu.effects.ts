import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActualizarDataItem, selecionModuloAction } from '@redux/actions/menu.actions';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuEffects {
  constructor(private actions$: Actions) {}

  guardarMenu$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(selecionModuloAction),
        tap((accion) => {
          localStorage.setItem('ruta', accion.seleccion);
        })
      ),
    { dispatch: false }
  );

  actualizarDataItem$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ActualizarDataItem),
        tap((action) => {
          localStorage.setItem('dataItem', JSON.stringify(action.dataItem));
        })
      ),
    { dispatch: false }
  );
}
