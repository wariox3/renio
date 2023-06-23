import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Usuario } from '@interfaces/usuario/usuario';

const UsuarioId = createFeatureSelector<Usuario>('usuario');

export const obtenerId = createSelector(
  UsuarioId,
  (UsuarioId) => `${UsuarioId.id}`
);

