import { Configuracion } from '@interfaces/configuracion/configuracion';
import { createAction, props } from '@ngrx/store';

export const configutacionActionInit = createAction(
  '[Configuracion] informacion',
  props<{ configuracion: Configuracion }>()
);

export const configuracionVisualizarAction = createAction(
  '[Configuracion] actualizar visualizar apps',
  props<{ configuracion: Configuracion }>()
);
