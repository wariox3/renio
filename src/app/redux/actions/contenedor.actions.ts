import { Contenedor } from '@interfaces/usuario/contenedor';
import { createAction, props } from '@ngrx/store';

export const ContenedorActionInit = createAction(
  '[Contenedor] informacion',
  props<{contenedor: Contenedor}>()
);

export const ContenedorGuardarAction = createAction(
  '[Contenedor] Guardar inquilino en localstore',
  props<{contenedor: Contenedor}>()
);

export const ContenedorSeleccionAction = createAction(
  '[Inquilino] Seleccionar Inquilino',
  props<{ seleccion: boolean }>()
);
