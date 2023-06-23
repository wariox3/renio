import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Usuario } from '@interfaces/usuario/usuario';

const UsuarioCargo = createFeatureSelector<Usuario>('usuario');

export const obtenerCargo = createSelector(
  UsuarioCargo,
  (UsuarioCargo) => `${UsuarioCargo.cargo}`
);
