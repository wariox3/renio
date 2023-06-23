import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Usuario } from '@interfaces/usuario/usuario';

const UsuarioNombre = createFeatureSelector<Usuario>('usuario');

export const obtenerNombre = createSelector(
  UsuarioNombre,
  (UsuarioNombre) => `${UsuarioNombre.username}`
);

