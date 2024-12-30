import { createAction, props } from '@ngrx/store';

export const asignarDocumentacion = createAction(
  '[Documentacion] asignar documentacion',
  props<{ id: number, nombre: string }>()
);
