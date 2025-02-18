import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Configuracion } from '@interfaces/configuracion/configuracion';

const Configuracion = createFeatureSelector<Configuracion>('configuracion');

export const obtenerConfiguracionVisualizarApp = createSelector(
  Configuracion,
  (Configuracion) => Configuracion.visualizarApps
);

export const obtenerConfiguracionVisualizarBreadCrumbs = createSelector(
  Configuracion,
  (Configuracion) => Configuracion.visualizarBreadCrumbs
);
