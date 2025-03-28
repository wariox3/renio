import { inject, Injectable } from '@angular/core';
import { cookieKey } from '@comun/services/domain/enums/cookie-key.enum';
import { CookieService } from '@comun/services/infrastructure/cookie.service';
import { Empresa } from '@interfaces/contenedor/empresa.interface';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  empresaActionInit,
  empresaActualizacionAction,
  empresaActualizacionImangenAction,
  empresaActualizacionRededocIdAction,
  empresaLimpiarAction,
} from '@redux/actions/empresa.actions';
import { tap } from 'rxjs/operators';

@Injectable()
export class EmpresaEffects {
  private readonly _cookieService = inject(CookieService);

  constructor(private actions$: Actions) {}

  guardarEmpresa$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(empresaActionInit),
        tap(({ empresa }) => {
          const tiempo = this._cookieService.calcularTiempoCookie(3);
          this._cookieService.set(cookieKey.EMPRESA, JSON.stringify(empresa), {
            expires: tiempo,
            path: '/',
          });
          // let calcularTresHoras = new Date(
          //   new Date().getTime() + 3 * 60 * 60 * 1000,
          // );

          // if (environment.production) {
          //   let nombre = window.location.host.split('.')[0];
          //   setCookie(
          //     `empresa-${nombre.toLowerCase()}`,
          //     JSON.stringify(action.empresa),
          //     {
          //       expires: calcularTresHoras,
          //       path: '/',
          //       domain: environment.dominioApp,
          //     },
          //   );
          // } else {
          //   setCookie(
          //     `empresa-${environment.EMPRESA_LOCALHOST}`,
          //     JSON.stringify(action.empresa),
          //     {
          //       expires: calcularTresHoras,
          //       path: '/',
          //     },
          //   );
          // }
        }),
      ),
    { dispatch: false },
  );

  actualizarInformacionCookie$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(empresaActualizacionAction),
        tap(({ empresa }) => {
          this._cookieService.set(cookieKey.EMPRESA, JSON.stringify(empresa), {
            path: '/',
          }); 
          // let empresaJson = this._cookieService.get(cookieKey.EMPRESA);

          // if (empresaJson) {
          //   empresa = JSON.parse(empresaJson);

          // empresa = {
          //   ...empresa,
          //   numero_identificacion: action.empresa.numero_identificacion,
          //   identificacion_id: action.empresa.identificacion_id,
          //   identificacion_nombre: action.empresa.identificacion_nombre,
          //   ciudad_id: action.empresa.ciudad_id,
          //   ciudad_nombre: action.empresa.ciudad_nombre,
          //   digito_verificacion: action.empresa.digito_verificacion,
          //   nombre_corto: action.empresa.nombre_corto,
          //   direccion: action.empresa.direccion,
          //   telefono: action.empresa.telefono,
          //   correo: action.empresa.correo,
          //   regimen_id: action.empresa.regimen_id,
          //   regimen_nombre: action.empresa.regimen_nombre,
          //   tipo_persona_id: action.empresa.tipo_persona_id,
          //   tipo_persona_nombre: action.empresa.tipo_persona_nombre,
          // };

          // }

          // if (environment.production) {
          //   let dominioActual = window.location.host;

          //   setCookie(
          //     `empresa-${dominioActual.split('.')[0]}`,
          //     JSON.stringify(jsonEmpresa),
          //     {
          //       path: '/',
          //       domain: environment.dominioApp,
          //     },
          //   );
          // } else {
          //   setCookie(
          //     `empresa-${environment.EMPRESA_LOCALHOST}`,
          //     JSON.stringify(jsonEmpresa),
          //     { path: '/' },
          //   );
          // }
        }),
      ),
    { dispatch: false },
  );

  actualizarImagenCookie$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(empresaActualizacionImangenAction),
        tap(({ imagen }) => {
          let empresaJson = this._cookieService.get(cookieKey.EMPRESA);

          if (empresaJson) {
            const empresaParsed = JSON.parse(empresaJson);
            const newEmpresa: Empresa = {
              ...empresaParsed,
              imagen,
            };

            this._cookieService.set(
              cookieKey.EMPRESA,
              JSON.stringify(newEmpresa),
              {
                path: '/',
              },
            );
          }
          // let contenedorDatos: any;

          // if (environment.production) {
          //   let dominioActual = window.location.host;
          //   contenedorDatos = getCookie(
          //     `empresa-${dominioActual.split('.')[0]}`,
          //   );
          // } else {
          //   contenedorDatos = getCookie(
          //     `empresa-${environment.EMPRESA_LOCALHOST}`,
          //   );
          // }
          // let jsonEmpresa: Empresa = JSON.parse(contenedorDatos);

          // jsonEmpresa = {
          //   ...jsonEmpresa,
          //   ...{
          //     imagen: action.imagen,
          //   },
          // };

          // if (environment.production) {
          //   let dominioActual = window.location.host;

          //   setCookie(
          //     `empresa-${dominioActual.split('.')[0]}`,
          //     JSON.stringify(jsonEmpresa),
          //     {
          //       path: '/',
          //       domain: environment.dominioApp,
          //     },
          //   );
          // } else {
          //   setCookie(
          //     `empresa-${environment.EMPRESA_LOCALHOST}`,
          //     JSON.stringify(jsonEmpresa),
          //     { path: '/' },
          //   );
          // }
        }),
      ),
    { dispatch: false },
  );

  actualizarRededoc_id$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(empresaActualizacionRededocIdAction),
        tap(({ rededoc_id }) => {
          let empresaJson = this._cookieService.get(cookieKey.EMPRESA);

          if (empresaJson) {
            const empresaParsed = JSON.parse(empresaJson);
            const newEmpresa: Empresa = {
              ...empresaParsed,
              rededoc_id,
            };

            this._cookieService.set(
              cookieKey.EMPRESA,
              JSON.stringify(newEmpresa),
              {
                path: '/',
              },
            );
          }
          // let contenedorDatos: any;
          // if (environment.production) {
          //   let dominioActual = window.location.host;
          //   contenedorDatos = getCookie(
          //     `empresa-${dominioActual.split('.')[0]}`,
          //   );
          // } else {
          //   contenedorDatos = getCookie(
          //     `empresa-${environment.EMPRESA_LOCALHOST}`,
          //   );
          // }
          // let jsonEmpresa: Empresa = JSON.parse(contenedorDatos);
          // jsonEmpresa = {
          //   ...jsonEmpresa,
          //   ...{
          //     rededoc_id: action.rededoc_id,
          //   },
          // };
          // if (environment.production) {
          //   let dominioActual = window.location.host;
          //   setCookie(
          //     `empresa-${dominioActual.split('.')[0]}`,
          //     JSON.stringify(jsonEmpresa),
          //     {
          //       path: '/',
          //       domain: environment.dominioApp,
          //     },
          //   );
          // } else {
          //   setCookie(
          //     `empresa-${environment.EMPRESA_LOCALHOST}`,
          //     JSON.stringify(jsonEmpresa),
          //     { path: '/' },
          //   );
          // }
        }),
      ),
    { dispatch: false },
  );

  eliminarEmpresa$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(empresaLimpiarAction),
        tap(() => {
          const cookieKeysLimpiar = [cookieKey.EMPRESA];
          cookieKeysLimpiar.map((cookieKey) => {
            this._cookieService.delete(cookieKey, '/');
          });
        }),
      ),
    {
      dispatch: false,
    },
  );
}
