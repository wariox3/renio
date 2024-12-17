import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ContenedorActionBorrarInformacion, ContenedorActionInit } from '@redux/actions/contenedor.actions';
import { tap } from 'rxjs/operators';
import { setCookie } from 'typescript-cookie';
import { removeCookie } from 'typescript-cookie';

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
                domain: environment.dominioApp,
              }
            );
          } else {
            setCookie(
              `contenedor-${environment.EMPRESA_LOCALHOST}`,
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

  eliminarContenedor$ = createEffect(() => this.actions$.pipe(
    ofType(ContenedorActionBorrarInformacion),
    tap(() => {
      const patrones = ['contenedor-'];
      document.cookie.split(';').forEach(function (cookie) {
        const cookieNombre = cookie.split('=')[0].trim();
        patrones.forEach(function (patron) {
          if (cookieNombre.startsWith(patron)) {
            removeCookie(cookieNombre);
            removeCookie(cookieNombre, { path: '/', domain: environment.dominioApp });
          }
        });
      });
    })

  ), { dispatch: false });

  constructor(private actions$: Actions) {}
}
