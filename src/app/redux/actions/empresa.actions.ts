import { Empresa } from '@interfaces/contenedor/empresa';
import { createAction, props } from '@ngrx/store';

export const empresaActionInit = createAction(
  '[Empresa] informacion',
  props<{ empresa: Empresa }>()
);

export const empresaActualizacionAction = createAction(
  '[Empresa] actualizar informacion',
  props<{ empresa: Empresa }>()
);

export const empresaActualizacionImangenAction = createAction(
  '[Empresa] actualizar imagen',
  props<{ imagen: string }>()
);

export const empresaLimpiarAction = createAction(
  '[Empresa] limpiar informacion'
);

export const empresaActualizacionRededocIdAction = createAction(
  '[Empresa] actualizar rededoc_id',
  props<{ rededoc_id: string }>()
);

export const empresaActualizacionAsisteneElectronico = createAction(
  '[Empresa] actualizar asistente electronico',
  props<{ asistente_electronico: boolean }>()
);
