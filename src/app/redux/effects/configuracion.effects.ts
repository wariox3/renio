import { Injectable } from '@angular/core';
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
  guardarConfiguracion$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(configutacionActionInit),
        tap((action) => {
          let calcularTresHoras = new Date(
            new Date().getTime() + 3 * 60 * 60 * 1000
          );

          if (environment.production) {
            setCookie(`configuracion`, JSON.stringify(action.configuracion), {
              expires: calcularTresHoras,
              path: '/',
              domain: environment.dominioApp,
            });
          } else {
            setCookie(`configuracion`, JSON.stringify(action.configuracion), {
              expires: calcularTresHoras,
              path: '/',
            });
          }
        })
      ),
    { dispatch: false }
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
        })
      ),
    { dispatch: false }
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
                  visualizarBreadCrumbs: action.configuracion.visualizarBreadCrumbs,
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
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions) {}
}
