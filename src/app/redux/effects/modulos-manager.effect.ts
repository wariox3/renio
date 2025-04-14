import { inject, Injectable } from '@angular/core';
import { cookieKey } from '@comun/services/domain/enums/cookie-key.enum';
import { CookieService } from '@comun/services/infrastructure/cookie.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
    ModulosManagerInit,
    ModulosManagerLimpiar,
} from '@redux/actions/modulos-manager.action';
import { tap } from 'rxjs/operators';

@Injectable()
export class ModulosManagerEffects {
  private readonly _cookieService = inject(CookieService);

  constructor(private actions$: Actions) {}

  guardarModulos$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ModulosManagerInit),
        tap(({ modulos }) => {
          const tiempo = this._cookieService.calcularTiempoCookie(3);
          this._cookieService.set(cookieKey.MODULOS, JSON.stringify(modulos), {
            expires: tiempo,
            path: '/',
          });
        }),
      ),
    { dispatch: false },
  );

  limpiarCookieModulos$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ModulosManagerLimpiar),
        tap(() => {
          const cookieKeysLimpiar = [cookieKey.MODULOS];
          cookieKeysLimpiar.map((cookieKey) => {
            this._cookieService.delete(cookieKey, '/');
          });
        }),
      ),
    { dispatch: false },
  );
}
