import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { empresaActionInit } from '@redux/actions/empresa.actions';
import { tap } from 'rxjs/operators';
import { setCookie } from 'typescript-cookie';

@Injectable()
export class EmpresaEffects {
  guardarConenedor$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(empresaActionInit),
        tap((action) => {
          let calcularTresHoras = new Date(
            new Date().getTime() + 3 * 60 * 60 * 1000
          );

          if (environment.production) {
            setCookie(
              `empresa-${action.empresa.nombre_corto}`,
              JSON.stringify(action.empresa),
              {
                expires: calcularTresHoras,
                path: '/',
                domain: `.muup.online`,
              }
            );
          } else {
            setCookie(
              `empresa-${environment.EMPRESA_LOCALHOST}`,
              JSON.stringify(action.empresa),
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
