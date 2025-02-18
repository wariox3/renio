import { Configuracion } from '@interfaces/configuracion/configuracion';
import { createAction, props } from '@ngrx/store';

export const configutacionActionInit = createAction(
  '[Configuracion] informacion',
  props<{ configuracion: Configuracion }>()
);

export const configuracionVisualizarAppsAction = createAction(
  '[Configuracion] actualizar visualizar apps',
  props<{ configuracion: {visualizarApps: boolean} }>()
);

export const configuracionVisualizarBreadCrumbsAction = createAction(
  '[Configuracion] actualizar BreadCrumbs',
  props<{ configuracion: { visualizarBreadCrumbs: boolean } }>()
);
