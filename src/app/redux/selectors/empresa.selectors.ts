import { Empresa } from '@interfaces/contenedor/empresa';
import { createFeatureSelector, createSelector } from '@ngrx/store';

const Empresa = createFeatureSelector<Empresa>('empresa');

export const obtenerEmpresaImagen = createSelector(
  Empresa,
  (Empresa) => `${Empresa.imagen}`
);
