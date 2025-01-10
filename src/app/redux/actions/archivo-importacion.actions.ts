import { createAction, props } from '@ngrx/store';

export const asignarArchivoImportacionLista = createAction(
  '[ArchivoImportacion] asignar archivoImportacion lista',
  props<{ lista: string | null }>()
);

export const asignarArchivoImportacionNuevo = createAction(
  '[ArchivoImportacion] asignar archivoImportacion nuevo',
  props<{ nuevo: string | null }>()
);

export const asignarArchivoImportacionDetalle = createAction(
  '[ArchivoImportacion] asignar archivoImportacion detalle',
  props<{ detalle: string | null }>()
);
