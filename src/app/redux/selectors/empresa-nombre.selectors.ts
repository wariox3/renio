import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Empresa } from '@interfaces/usuario/empresa';

const EmpresaNombre = createFeatureSelector<Empresa>('empresa');

export const obtenerEmpresaNombre = createSelector(
  EmpresaNombre,
  (EmpresaNombre) => `${EmpresaNombre.nombre}`
);
