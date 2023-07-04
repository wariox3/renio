import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { empresaActionInit } from '@redux/actions/empresa.actions';
import { map, tap } from 'rxjs/operators';
import { setCookie } from 'typescript-cookie';

@Injectable()
export class EmpresaEffects {
  guardarEmpresa$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(empresaActionInit),
        tap((action) => {
          let calcularTresHoras = new Date(
            new Date().getTime() + 3 * 60 * 60 * 1000
          );
          console.log(`${action.empresa.subdominio}.muup.online`);

          if (environment.production) {
            setCookie(
              `empresa-${action.empresa.subdominio}`,
              JSON.stringify(action.empresa),
              {
                expires: calcularTresHoras,
                path: '/',
                domain: `.muup.online`,
              }
            );
          } else {
            setCookie(
              `empresa-${action.empresa.subdominio}`,
              JSON.stringify(action.empresa),
              {
                expires: calcularTresHoras,
                path: '/',
              }
            );
          }

          window.location.href = `http://${action.empresa.subdominio}.muup.online/dashboard`;
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions) {}
}
