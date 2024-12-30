import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { asignarDocumentacion } from '@redux/actions/documentacion.actions';
import { tap } from 'rxjs/operators';

@Injectable()
export class DocumentacionEffects {
  constructor(private actions$: Actions) {}

  guardarEnLocalStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(asignarDocumentacion), // Intercepta la acción de establecer documentacionId
        tap(({ id, nombre }) => {

          // Guardar en localStorage
          localStorage.setItem(
            'documentacion',
            JSON.stringify({
              id,
              nombre,
            })
          );
        })
      ),
    { dispatch: false } // No emite una nueva acción al store
  );
}
