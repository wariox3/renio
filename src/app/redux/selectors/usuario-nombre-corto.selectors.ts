import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Usuario } from '@interfaces/usuario/usuario';

const UsuarioNombreCorto = createFeatureSelector<Usuario>('usuario');

export const obtenerUsuarioNombreCorto = createSelector(
  UsuarioNombreCorto,
  (UsuarioNombreCorto) => `${UsuarioNombreCorto.nombre_corto}`
);

