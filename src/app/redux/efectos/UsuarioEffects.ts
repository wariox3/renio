import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  usuarioActionActualizarEstadoVerificado,
  usuarioActionActualizarIdioma,
  usuarioActionActualizarImagen,
  usuarioActionActualizarInformacionUsuario,
  usuarioActionActualizarVrSaldo,
  usuarioActionInit,
} from '@redux/actions/usuario.actions';
import { tap } from 'rxjs/operators';
import { getCookie, setCookie } from 'typescript-cookie';

@Injectable()
export class UsuarioEffects {

  guardarEmpresa$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(usuarioActionInit),
        tap((action) => {
          let calcularTresHoras = new Date(
            new Date().getTime() + 3 * 60 * 60 * 1000
          );
          if (environment.production) {
            setCookie('usuario', JSON.stringify(action.usuario), {
              expires: calcularTresHoras,
              path: '/',
              domain: environment.dominioApp,
            });
          } else {
            setCookie('usuario', JSON.stringify(action.usuario), {
              expires: calcularTresHoras,
              path: '/',
            });
          }
        })
      ),
    { dispatch: false }
  );

  updateCookie$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(usuarioActionActualizarInformacionUsuario),
        tap((action) => {
          let coockieUsuario = getCookie('usuario');
          if (coockieUsuario) {
            let jsonUsuario = JSON.parse(coockieUsuario);
            jsonUsuario.nombre = action.nombre;
            jsonUsuario.apellido = action.apellido;
            jsonUsuario.telefono = action.telefono;
            jsonUsuario.nombre_corto = action.nombre_corto;
            jsonUsuario.idioma = action.idioma;
            if (environment.production) {
              setCookie('usuario', JSON.stringify(jsonUsuario), {
                path: '/',
                domain: environment.dominioApp,
              });
            } else {
              setCookie('usuario', JSON.stringify(jsonUsuario), { path: '/' });
            }
          }
        })
      ),
    { dispatch: false }
  );

  updateCookieIdioma$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(usuarioActionActualizarIdioma),
        tap((action) => {
          let coockieUsuario = getCookie('usuario');
          if (coockieUsuario) {
            let jsonUsuario = JSON.parse(coockieUsuario);
            jsonUsuario.idioma = action.idioma;
            if (environment.production) {
              setCookie('usuario', JSON.stringify(jsonUsuario), {
                path: '/',
                domain: environment.dominioApp,
              });
            } else {
              setCookie('usuario', JSON.stringify(jsonUsuario), { path: '/' });
            }
          }
        })
      ),
    { dispatch: false }
  );

  updateCookieImagen$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(usuarioActionActualizarImagen),
        tap((action) => {
          let coockieUsuario = getCookie('usuario');
          if (coockieUsuario) {
            let jsonUsuario = JSON.parse(coockieUsuario);
            jsonUsuario.imagen = action.imagen;
            if (environment.production) {
              setCookie('usuario', JSON.stringify(jsonUsuario), {
                path: '/',
                domain: environment.dominioApp,
              });
            } else {
              setCookie('usuario', JSON.stringify(jsonUsuario), { path: '/' });
            }
          }
        })
      ),
    { dispatch: false }
  );

  updateCookieVrSaldo$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(usuarioActionActualizarVrSaldo),
        tap((action) => {
          let coockieUsuario = getCookie('usuario');
          if (coockieUsuario) {
            let jsonUsuario = JSON.parse(coockieUsuario);
            jsonUsuario.vr_saldo = action.vr_saldo;
            if (environment.production) {
              setCookie('usuario', JSON.stringify(jsonUsuario), {
                path: '/',
                domain: environment.dominioApp,
              });
            } else {
              setCookie('usuario', JSON.stringify(jsonUsuario), { path: '/' });
            }
          }
        })
      ),
    { dispatch: false }
  );

  updateCookieEstadoVerificado$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(usuarioActionActualizarEstadoVerificado),
        tap((action) => {
          let coockieUsuario = getCookie('usuario');
          if (coockieUsuario) {
            let jsonUsuario = JSON.parse(coockieUsuario);
            jsonUsuario.estado_verificado = action.estado_verificado;
            if (environment.production) {
              setCookie('usuario', JSON.stringify(jsonUsuario), {
                path: '/',
                domain: environment.dominioApp,
              });
            } else {
              setCookie('usuario', JSON.stringify(jsonUsuario), { path: '/' });
            }
          }
        })
      ),
    { dispatch: false }
  );


  constructor(private actions$: Actions) {}
}
