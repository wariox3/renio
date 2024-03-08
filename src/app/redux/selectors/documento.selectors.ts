import { createFeatureSelector, createSelector } from '@ngrx/store';

const Documento = createFeatureSelector<any>('documento');

export const obtenerDocumentosEstado = createSelector(
    Documento,
  (documento) => documento
);
