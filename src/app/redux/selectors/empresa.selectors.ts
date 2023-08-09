import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Empresa } from '@interfaces/usuario/empresa';

const Empresa = createFeatureSelector<Empresa>('empresa');

export const obtenerEmpresaSeleccion = createSelector(
  Empresa,
  (empresaSeleccion) => empresaSeleccion.seleccion
);

export const obtenerEmpresaNombre = createSelector(
  Empresa,
  (Empresa) => `${Empresa.nombre}`
);

export const obtenerLogoEmpresa = createSelector(
  Empresa,
  (Empresa) => `${Empresa.imagen}`
);

export const obtenerEmpresaId = createSelector(
  Empresa,
  (Empresa) => `${Empresa.id}`
);


export const obtenerEmpresaSubdominio = createSelector(
  Empresa,
  (Empresa) => `${Empresa.subdominio}`
);
