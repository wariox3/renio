import { ArchivoImportacion } from '@interfaces/comunes/archivo-importacion';
import { Documentacion } from '@interfaces/comunes/documentacion';
import { createFeatureSelector, createSelector } from '@ngrx/store';


const ArchivoImportacion = createFeatureSelector<ArchivoImportacion>('archivoImportacion');

export const obtenerArchivoImportacionLista = createSelector(
  ArchivoImportacion,
  (ArchivoImportacion) => ArchivoImportacion.lista
);

export const obtenerArchivoImportacionNuevo = createSelector(
  ArchivoImportacion,
  (ArchivoImportacion) => ArchivoImportacion.nuevo
);

export const obtenerArchivoImportacionDetalle = createSelector(
  ArchivoImportacion,
  (ArchivoImportacion) => ArchivoImportacion.detalle
);
