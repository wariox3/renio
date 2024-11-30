import { createAction, props } from '@ngrx/store';

export const asignarDocumentacionId = createAction(
  '[Documentacion] asignar documentacion id',
  props<{ id: number }>()
);
