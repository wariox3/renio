import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Empresa } from '@interfaces/usuario/empresa';

const EmpresaLogo = createFeatureSelector<Empresa>('empresa');

export const obtenerLogoEmpresa = createSelector(
  EmpresaLogo,
  (EmpresaLogo) => `${EmpresaLogo.logo}`
);

