import { Modulos } from '@interfaces/usuario/contenedor';
import { createAction, props } from '@ngrx/store';

export const ModulosManagerInit = createAction(
  '[ModulosManager] cargar datos',
  props<{ modulos: Modulos }>(),
);

export const ModulosManagerLimpiar = createAction(
  '[ModulosManager] borrar informacion',
);
