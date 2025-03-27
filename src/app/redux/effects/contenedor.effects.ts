import { inject, Injectable } from '@angular/core';
import { cookieKey } from '@comun/services/domain/enums/cookie-key.enum';
import { CookieService } from '@comun/services/infrastructure/cookie.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  ContenedorActionBorrarInformacion,
  ContenedorActionInit,
} from '@redux/actions/contenedor.actions';
import { tap } from 'rxjs/operators';

@Injectable()
export class ContenedorEffects {
  private readonly _cookieService = inject(CookieService);

  constructor(private actions$: Actions) {}

  guardarConenedor$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ContenedorActionInit),
        tap(({ contenedor }) => {
          const tiempo = this._cookieService.calcularTiempoCookie(3);
          this._cookieService.set(
            cookieKey.CONTENEDOR,
            JSON.stringify(contenedor),
            {
              expires: tiempo,
              path: '/',
            },
          );
        }),
      ),
    { dispatch: false },
  );

  limpiarCookieContenedor$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ContenedorActionBorrarInformacion),
        tap(() => {
          const cookieKeysLimpiar = [cookieKey.CONTENEDOR];
          cookieKeysLimpiar.map((cookieKey) => {
            this._cookieService.delete(cookieKey, '/');
          });
        }),
      ),
    { dispatch: false },
  );
}
