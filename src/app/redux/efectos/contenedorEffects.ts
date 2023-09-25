import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ContenedorActionInit } from '@redux/actions/contenedor.actions';
import { tap } from 'rxjs/operators';
import { setCookie } from 'typescript-cookie';

@Injectable()
export class ContenedorEffects {
  guardarConenedor$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ContenedorActionInit),
        tap((action) => {
          let calcularTresHoras = new Date(
            new Date().getTime() + 3 * 60 * 60 * 1000
          );

          if (environment.production) {
            setCookie(
              `contenedor-${action.contenedor.subdominio}`,
              JSON.stringify(action.contenedor),
              {
                expires: calcularTresHoras,
                path: '/',
                domain: `.muup.online`,
              }
            );
          } else {
            setCookie(
              `contenedor-${action.contenedor.subdominio}`,
              JSON.stringify(action.contenedor),
              {
                expires: calcularTresHoras,
                path: '/',
              }
            );
          }
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions) {}
}
