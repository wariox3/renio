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
