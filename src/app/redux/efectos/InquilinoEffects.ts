import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { InquilinoActionInit } from '@redux/actions/inquilino.actions';
import { tap } from 'rxjs/operators';
import { setCookie } from 'typescript-cookie';

@Injectable()
export class InquilinoEffects {
  guardarInquilino$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InquilinoActionInit),
        tap((action) => {
          let calcularTresHoras = new Date(
            new Date().getTime() + 3 * 60 * 60 * 1000
          );

          if (environment.production) {
            setCookie(
              `empresa-${action.inquilino.subdominio}`,
              JSON.stringify(action.inquilino),
              {
                expires: calcularTresHoras,
                path: '/',
                domain: `.muup.online`,
              }
            );
          } else {
            setCookie(
              `empresa-${action.inquilino.subdominio}`,
              JSON.stringify(action.inquilino),
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
