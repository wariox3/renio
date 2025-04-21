import { inject, Injectable } from '@angular/core';
import { CookieService } from '@comun/services/infrastructure/cookie.service';
import { environment } from '@env/environment';
import { Configuracion } from '@interfaces/configuracion/configuracion';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  configuracionVisualizarAppsAction,
  configuracionVisualizarBreadCrumbsAction,
  configutacionActionInit,
} from '@redux/actions/configuracion.actions';
import { tap } from 'rxjs/operators';
import { getCookie, setCookie } from 'typescript-cookie';

@Injectable()
export class ConfiguracionEffects {
  private readonly _cookieService = inject(CookieService);

  guardarConfiguracion$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(configutacionActionInit),
        tap((action) => {
          const tiempo = this._cookieService.calcularTiempoCookie(
            environment.sessionLifeTime,
          );

          if (environment.production) {
            setCookie(`configuracion`, JSON.stringify(action.configuracion), {
              expires: tiempo,
              path: '/',
              domain: environment.dominioApp,
            });
          } else {
            setCookie(`configuracion`, JSON.stringify(action.configuracion), {
              expires: tiempo,
              path: '/',
            });
          }
        }),
      ),
    { dispatch: false },
  );

  // Efecto para actualizar la cookie de visualizarApps
  actualizarVisualizarApps$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(configuracionVisualizarAppsAction),
        tap((action) => {
          let coockieConfiguracion = getCookie('configuracion');
          if (coockieConfiguracion) {
            let jsonConfiguracion: Configuracion =
              JSON.parse(coockieConfiguracion);
            jsonConfiguracion = {
              ...jsonConfiguracion,
              visualizarApps: action.configuracion.visualizarApps,
            };

            if (environment.production) {
              setCookie('configuracion', JSON.stringify(jsonConfiguracion), {
                path: '/',
                domain: environment.dominioApp,
              });
            } else {
              setCookie('configuracion', JSON.stringify(jsonConfiguracion), {
                path: '/',
              });
            }
          }
        }),
      ),
    { dispatch: false },
  );

  actualizarVisualizarBreadCrumbs$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(configuracionVisualizarBreadCrumbsAction),
        tap((action) => {
          let coockieConfiguracion = getCookie('configuracion');
          if (coockieConfiguracion) {
            if (coockieConfiguracion) {
              let jsonConfiguracion: Configuracion =
                JSON.parse(coockieConfiguracion);
              jsonConfiguracion = {
                ...jsonConfiguracion,
                visualizarBreadCrumbs:
                  action.configuracion.visualizarBreadCrumbs,
              };
              if (environment.production) {
                setCookie('configuracion', JSON.stringify(jsonConfiguracion), {
                  path: '/',
                  domain: environment.dominioApp,
                });
              } else {
                setCookie('configuracion', JSON.stringify(jsonConfiguracion), {
                  path: '/',
                });
              }
            }
          }
        }),
      ),
    { dispatch: false },
  );

  constructor(private actions$: Actions) {}
}
