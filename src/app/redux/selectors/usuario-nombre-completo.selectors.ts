import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Usuario } from '@interfaces/usuario/usuario';

const UsuarioNombreCompleto = createFeatureSelector<Usuario>('usuario');

export const obtenerUsuarioNombreCompleto = createSelector(
  UsuarioNombreCompleto,
  (UsuarioNombreCompleto) => `${UsuarioNombreCompleto.nombre} ${UsuarioNombreCompleto.apellido}` 
);
