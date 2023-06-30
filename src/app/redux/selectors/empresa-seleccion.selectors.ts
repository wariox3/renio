import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Empresa } from '@interfaces/usuario/empresa';

const Empresa = createFeatureSelector<Empresa>('empresa');

export const obtenerEmpresaSeleccion = createSelector(
  Empresa,
  (EmpresaSeleccion) => `${EmpresaSeleccion.seleccion}`
);

