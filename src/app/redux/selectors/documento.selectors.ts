import { Documento } from '@interfaces/comunes/documento';
import { createFeatureSelector, createSelector } from '@ngrx/store';

const Documento = createFeatureSelector<Documento>('documento');

export const obtenerDocumentosEstado = createSelector(
    Documento,
  (documento) => documento
);
