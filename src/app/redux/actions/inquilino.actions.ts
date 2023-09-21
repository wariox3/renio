import { Inquilino } from '@interfaces/usuario/inquilino';
import { createAction, props } from '@ngrx/store';

export const InquilinoActionInit = createAction(
  '[Inquilino] informacion',
  props<{inquilino: Inquilino}>()
);

export const InquilinoGuardarAction = createAction(
  '[Inquilino] Guardar inquilino en localstore',
  props<{inquilino: Inquilino}>()
);

export const InquilinoSeleccionAction = createAction(
  '[Inquilino] Seleccionar Inquilino',
  props<{ seleccion: boolean }>()
);
