import { inject, Injectable } from '@angular/core';
import { CookieService } from '@comun/services/infrastructure/cookie.service';
import { environment } from '@env/environment';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  usuarioActionActualizarEstadoVerificado,
  usuarioActionActualizarIdioma,
  usuarioActionActualizarImagen,
  usuarioActionActualizarInformacionUsuario,
  usuarioActionActualizarVrCredito,
  usuarioActionActualizarVrSaldo,
  usuarioActionInit,
} from '@redux/actions/usuario.actions';
import { tap } from 'rxjs/operators';
import { getCookie, setCookie } from 'typescript-cookie';

@Injectable()
export class UsuarioEffects {
  private readonly _cookieService = inject(CookieService);

  guardarEmpresa$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(usuarioActionInit),
        tap((action) => {
          const tiempo = this._cookieService.calcularTiempoCookie(
            environment.sessionLifeTime,
          );

          if (environment.production) {
            setCookie('usuario', JSON.stringify(action.usuario), {
              expires: tiempo,
              path: '/',
              domain: environment.dominioApp,
            });
          } else {
            setCookie('usuario', JSON.stringify(action.usuario), {
              expires: tiempo,
              path: '/',
            });
          }
        }),
      ),
    { dispatch: false },
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
            const tiempo = this._cookieService.calcularTiempoCookie(
              environment.sessionLifeTime,
            );
            if (environment.production) {
              setCookie('usuario', JSON.stringify(jsonUsuario), {
                expires: tiempo,
                path: '/',
                domain: environment.dominioApp,
              });
            } else {
              setCookie('usuario', JSON.stringify(jsonUsuario), { 
                expires: tiempo,
                path: '/' 
              });
            }
          }
        }),
      ),
    { dispatch: false },
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
            const tiempo = this._cookieService.calcularTiempoCookie(
              environment.sessionLifeTime,
            );
            if (environment.production) {
              setCookie('usuario', JSON.stringify(jsonUsuario), {
                expires: tiempo,
                path: '/',
                domain: environment.dominioApp,
              });
            } else {
              setCookie('usuario', JSON.stringify(jsonUsuario), { 
                expires: tiempo,
                path: '/' 
              });
            }
          }
        }),
      ),
    { dispatch: false },
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
            const tiempo = this._cookieService.calcularTiempoCookie(
              environment.sessionLifeTime,
            );
            if (environment.production) {
              setCookie('usuario', JSON.stringify(jsonUsuario), {
                expires: tiempo,
                path: '/',
                domain: environment.dominioApp,
              });
            } else {
              setCookie('usuario', JSON.stringify(jsonUsuario), { 
                expires: tiempo,
                path: '/' 
              });
            }
          }
        }),
      ),
    { dispatch: false },
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
            const tiempo = this._cookieService.calcularTiempoCookie(
              environment.sessionLifeTime,
            );
            if (environment.production) {
              setCookie('usuario', JSON.stringify(jsonUsuario), {
                expires: tiempo,
                path: '/',
                domain: environment.dominioApp,
              });
            } else {
              setCookie('usuario', JSON.stringify(jsonUsuario), { 
                expires: tiempo,
                path: '/' 
              });
            }
          }
        }),
      ),
    { dispatch: false },
  );

  updateCookieVrCredito$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(usuarioActionActualizarVrCredito),
        tap((action) => {
          let coockieUsuario = getCookie('usuario');
          if (coockieUsuario) {
            let jsonUsuario = JSON.parse(coockieUsuario);
            jsonUsuario.vr_credito = action.vr_credito;
            const tiempo = this._cookieService.calcularTiempoCookie(
              environment.sessionLifeTime,
            );
            if (environment.production) {
              setCookie('usuario', JSON.stringify(jsonUsuario), {
                expires: tiempo,
                path: '/',
                domain: environment.dominioApp,
              });
            } else {
              setCookie('usuario', JSON.stringify(jsonUsuario), { 
                expires: tiempo,
                path: '/' 
              });
            }
          }
        }),
      ),
    { dispatch: false },
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
            const tiempo = this._cookieService.calcularTiempoCookie(
              environment.sessionLifeTime,
            );
            if (environment.production) {
              setCookie('usuario', JSON.stringify(jsonUsuario), {
                expires: tiempo,
                path: '/',
                domain: environment.dominioApp,
              });
            } else {
              setCookie('usuario', JSON.stringify(jsonUsuario), { 
                expires: tiempo,
                path: '/' 
              });
            }
          }
        }),
      ),
    { dispatch: false },
  );

  constructor(private actions$: Actions) {}
}
