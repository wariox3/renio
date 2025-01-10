import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import {
  asignarArchivoImportacionDetalle,
  asignarArchivoImportacionLista,
  asignarArchivoImportacionNuevo,
} from '@redux/actions/archivo-importacion.actions';
import { tap } from 'rxjs/operators';

@Injectable()
export class ArchivoImportacionEffects {
  constructor(private actions$: Actions) {}

  guardarEnLocalStorageLista$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(asignarArchivoImportacionLista), // Intercepta la acción de establecer documentacionId
        tap(({ lista }) => {
          // Guardar en localStorage
          if (lista) {
            localStorage.setItem('asignarArchivoImportacionLista', lista);
          }
        })
      ),
    { dispatch: false } // No emite una nueva acción al store
  );

  guardarEnLocalStorageNuevo$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(asignarArchivoImportacionNuevo), // Intercepta la acción de establecer documentacionId
        tap(({ nuevo }) => {
          // Guardar en localStorage
          if (nuevo) {
            localStorage.setItem('asignarArchivoImportacionNuevo', nuevo);
          }
        })
      ),
    { dispatch: false } // No emite una nueva acción al store
  );

  guardarEnLocalStorageDetalle$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(asignarArchivoImportacionDetalle), // Intercepta la acción de establecer documentacionId
        tap(({ detalle }) => {
          // Guardar en localStorage
          if (detalle) {
            localStorage.setItem('asignarArchivoImportacionDetalle', detalle);
          }
        })
      ),
    { dispatch: false } // No emite una nueva acción al store
  );
}
