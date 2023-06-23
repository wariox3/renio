import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Usuario } from '@interfaces/usuario/usuario';

const UsuarioImagen = createFeatureSelector<Usuario>('usuario');

export const obtenerImagen = createSelector(
  UsuarioImagen,
  (UsuarioImagen) => `${UsuarioImagen.imgen}`
);

