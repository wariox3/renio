import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Empresa } from '@interfaces/contenedor/empresa';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  empresaActionInit,
  empresaLimpiarAction,
  empresaActualizacionAction,
  empresaActualizacionImangenAction,
  empresaActualizacionRededocIdAction,
} from '@redux/actions/empresa.actions';
import { tap } from 'rxjs/operators';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';

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
            let nombre = window.location.host.split('.')[0];
            setCookie(
              `empresa-${nombre.toLowerCase()}`,
              JSON.stringify(action.empresa),
              {
                expires: calcularTresHoras,
                path: '/',
                domain: environment.dominioApp,
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

  actualizarInformacionCookie$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(empresaActualizacionAction),
        tap((action) => {
          let contenedorDatos: any;

          if (environment.production) {
            let dominioActual = window.location.host;
            contenedorDatos = getCookie(
              `empresa-${dominioActual.split('.')[0]}`
            );
          } else {
            contenedorDatos = getCookie(
              `empresa-${environment.EMPRESA_LOCALHOST}`
            );
          }
          let jsonEmpresa: Empresa = JSON.parse(contenedorDatos);

          jsonEmpresa = {
            ...jsonEmpresa,
            ...{
              numero_identificacion: action.empresa.numero_identificacion,
              identificacion_id: action.empresa.identificacion,
              identificacion_nombre: action.empresa.identificacion_nombre,
              ciudad_id: action.empresa.ciudad,
              ciudad_nombre: action.empresa.ciudad_nombre,
              digito_verificacion: action.empresa.digito_verificacion,
              nombre_corto: action.empresa.nombre_corto,
              direccion: action.empresa.direccion,
              telefono: action.empresa.telefono,
              correo: action.empresa.correo,
              regimen: action.empresa.regimen,
              regimen_nombre: action.empresa.regimen_nombre,
              tipo_persona: action.empresa.tipo_persona,
              tipo_persona_nombre: action.empresa.tipo_persona_nombre,
            },
          };

          if (environment.production) {
            let dominioActual = window.location.host;

            setCookie(
              `empresa-${dominioActual.split('.')[0]}`,
              JSON.stringify(jsonEmpresa),
              {
                path: '/',
                domain: environment.dominioApp,
              }
            );
          } else {
            setCookie(
              `empresa-${environment.EMPRESA_LOCALHOST}`,
              JSON.stringify(jsonEmpresa),
              { path: '/' }
            );
          }
        })
      ),
    { dispatch: false }
  );

  actualizarImagenCookie$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(empresaActualizacionImangenAction),
        tap((action) => {
          let contenedorDatos: any;

          if (environment.production) {
            let dominioActual = window.location.host;
            contenedorDatos = getCookie(
              `empresa-${dominioActual.split('.')[0]}`
            );
          } else {
            contenedorDatos = getCookie(
              `empresa-${environment.EMPRESA_LOCALHOST}`
            );
          }
          let jsonEmpresa: Empresa = JSON.parse(contenedorDatos);

          jsonEmpresa = {
            ...jsonEmpresa,
            ...{
              imagen: action.imagen,
            },
          };

          if (environment.production) {
            let dominioActual = window.location.host;

            setCookie(
              `empresa-${dominioActual.split('.')[0]}`,
              JSON.stringify(jsonEmpresa),
              {
                path: '/',
                domain: environment.dominioApp,
              }
            );
          } else {
            setCookie(
              `empresa-${environment.EMPRESA_LOCALHOST}`,
              JSON.stringify(jsonEmpresa),
              { path: '/' }
            );
          }
        })
      ),
    { dispatch: false }
  );

  actualizarRededoc_id$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(empresaActualizacionRededocIdAction),
        tap((action) => {
          let contenedorDatos: any;

          if (environment.production) {
            let dominioActual = window.location.host;
            contenedorDatos = getCookie(
              `empresa-${dominioActual.split('.')[0]}`
            );
          } else {
            contenedorDatos = getCookie(
              `empresa-${environment.EMPRESA_LOCALHOST}`
            );
          }
          let jsonEmpresa: Empresa = JSON.parse(contenedorDatos);

          jsonEmpresa = {
            ...jsonEmpresa,
            ...{
              rededoc_id: action.rededoc_id,
            },
          };

          if (environment.production) {
            let dominioActual = window.location.host;

            setCookie(
              `empresa-${dominioActual.split('.')[0]}`,
              JSON.stringify(jsonEmpresa),
              {
                path: '/',
                domain: environment.dominioApp,
              }
            );
          } else {
            setCookie(
              `empresa-${environment.EMPRESA_LOCALHOST}`,
              JSON.stringify(jsonEmpresa),
              { path: '/' }
            );
          }
        })
      ),
    { dispatch: false }
  );

  eliminarEmpresa$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(empresaLimpiarAction),
        tap(() => {
          const empresaPatron = 'empresa-';
          document.cookie.split(';').forEach(function (cookie) {
            const cookieNombre = cookie.split('=')[0].trim();
            if (cookieNombre.startsWith(empresaPatron)) {
              removeCookie(cookieNombre);
            }
          });
        })
      ),
    {
      dispatch: false,
    }
  );
}
