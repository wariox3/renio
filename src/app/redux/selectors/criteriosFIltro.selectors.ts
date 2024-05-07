import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CriteriosFiltro } from '../reducers/criteriosfiltros.reducer';

const CriteriosFiltro =
  createFeatureSelector<CriteriosFiltro>('criteriosFiltro');

export const obtenerCriteriosFiltro = (valorBusqueda: string) =>
  createSelector(
    CriteriosFiltro,
    (CriteriosFiltro) => (CriteriosFiltro[valorBusqueda])
  );

export const obtenerValorCriteriosFiltroDefecto = (valorBusqueda: string) =>
    createSelector(
      CriteriosFiltro,
      (CriteriosFiltro) => (CriteriosFiltro[valorBusqueda].find(item => item.defecto === true))
    );
