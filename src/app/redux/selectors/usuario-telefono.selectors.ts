import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Usuario } from '@interfaces/usuario/usuario';

const UsuarioTelefono = createFeatureSelector<Usuario>('usuario');

export const obtenerUsuarioTelefono = createSelector(
  UsuarioTelefono,
  (UsuarioTelefono) => `${UsuarioTelefono.telefono}`
);

