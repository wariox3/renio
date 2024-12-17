import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { asignarDocumentacionId } from '@redux/actions/documentacion.actions';
import { tap } from 'rxjs/operators';

@Injectable()
export class DocumentacionEffects {
  constructor(private actions$: Actions) {}

  guardarEnLocalStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(asignarDocumentacionId), // Intercepta la acción de establecer documentacionId
        tap(({ id }) => {
          // Guardar en localStorage
          localStorage.setItem('documentacionId', id.toString());
        })
      ),
    { dispatch: false } // No emite una nueva acción al store
  );
}
