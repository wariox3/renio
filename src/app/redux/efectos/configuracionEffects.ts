import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { configuracionVisualizarAction } from '@redux/actions/configuracion.actions';
import { tap } from 'rxjs/operators';
import { setCookie } from 'typescript-cookie';

@Injectable()
export class ConfiguracionEffects {
  guardarConenedor$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(configuracionVisualizarAction),
        tap((action) => {
          let calcularTresHoras = new Date(
            new Date().getTime() + 3 * 60 * 60 * 1000
          );

          if (environment.production) {
            setCookie(`configuracion`, JSON.stringify(action.configuracion), {
              expires: calcularTresHoras,
              path: '/',
              domain: `.reddoc.online`,
            });
          } else {
            setCookie(`configuracion`, JSON.stringify(action.configuracion), {
              expires: calcularTresHoras,
              path: '/',
            });
          }
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions) {}
}
