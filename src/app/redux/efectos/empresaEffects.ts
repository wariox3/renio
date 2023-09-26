import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { empresaActionInit, empresaLimpiarAction } from '@redux/actions/empresa.actions';
import { tap } from 'rxjs/operators';
import { removeCookie, setCookie } from 'typescript-cookie';

@Injectable()
export class EmpresaEffects {

  constructor(private actions$: Actions) {}

  guardarEmpresa$ = createEffect(
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

  eliminarEmpresa$= createEffect(()=>
        this.actions$.pipe(
          ofType(empresaLimpiarAction),
          tap(()=>{
            const empresaPatron = 'empresa-';
            document.cookie.split(';').forEach(function (cookie) {
              const cookieNombre = cookie.split('=')[0].trim();
              if (cookieNombre.startsWith(empresaPatron)) {
                removeCookie(cookieNombre);
              }
            });
          })
        ), {
          dispatch: false
        }
  )
}
