import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Usuario } from '@interfaces/usuario/usuario';

const Usuarioidioma = createFeatureSelector<Usuario>('usuario');

export const obtenerUsuarioidioma = createSelector(
  Usuarioidioma,
  (Usuarioidioma) => `${Usuarioidioma.idioma}`
);

