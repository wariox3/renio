import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Usuario } from '@interfaces/usuario/usuario';

const UsuarioCorreo = createFeatureSelector<Usuario>('usuario');

export const obtenerUsuarioCorreo = createSelector(
  UsuarioCorreo,
  (UsuarioCorreo) => `${UsuarioCorreo.username}`
);

