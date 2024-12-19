import { Documentacion } from '@interfaces/comunes/documentacion/documentacion';
import { createFeatureSelector, createSelector } from '@ngrx/store';


const Documentacion = createFeatureSelector<Documentacion>('documentacion');


export const obtenerDocumentacionIdSeleccion = createSelector(
  Documentacion,
  (Documentacion) => Documentacion.id
);
