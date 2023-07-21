import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Usuario } from '@interfaces/usuario/usuario';


const Usuario = createFeatureSelector<Usuario>('usuario');


export const obtenerUsuarioTelefono = createSelector(
  Usuario,
  (Usuario) => `${Usuario.telefono}`
);

export const obtenerUsuarioNombre = createSelector(
  Usuario,
  (Usuario) => `${Usuario.username}`
);

export const obtenerUsuarioNombreCorto = createSelector(
  Usuario,
  (Usuario) => `${Usuario.nombre_corto}`
);

export const obtenerUsuarioNombreCompleto = createSelector(
  Usuario,
  (Usuario) => `${Usuario.nombre} ${Usuario.apellido}`
);

export const obtenerUsuarioImagen = createSelector(
  Usuario,
  (Usuario) => `${Usuario.imgen}`
);

export const obtenerUsuarioidioma = createSelector(
  Usuario,
  (Usuario) => `${Usuario.idioma}`
);

export const obtenerUsuarioId = createSelector(
  Usuario,
  (Usuario) => `${Usuario.id}`
);

export const obtenerUsuarioCargo = createSelector(
  Usuario,
  (Usuario) => `${Usuario.cargo}`
);


export const obtenerUsuarioSuspencion = createSelector(
  Usuario,
  (Usuario) => Usuario.vr_saldo > 0 && new Date(Usuario.fecha_limite_pago) <=  new Date()
);

