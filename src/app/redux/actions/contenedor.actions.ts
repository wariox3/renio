import { Contenedor } from '@interfaces/usuario/contenedor';
import { createAction, props } from '@ngrx/store';

export const ContenedorActionInit = createAction(
  '[Contenedor] informacion',
  props<{contenedor: Contenedor}>()
);

export const ContenedorGuardarAction = createAction(
  '[Contenedor] Guardar contenedor en localstore',
  props<{contenedor: Contenedor}>()
);

export const ContenedorSeleccionAction = createAction(
  '[Contenedor] Seleccionar contenedor',
  props<{ seleccion: boolean }>()
);

export const ContenedorActionBorrarInformacion = createAction(
  '[Contenedor] borrar informacion'
);

export const ContenedorActionActualizarImagen = createAction(
  '[Contenedor] actualizar imagen',
  props<{ imagen: string }>()
);
