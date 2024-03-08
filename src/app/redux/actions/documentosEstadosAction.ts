import { createAction, props } from '@ngrx/store';

export const documentosEstadosAction = createAction(
  '[Documento] Guardar documento en localstore',
  props<{ estados: any }>()
);
