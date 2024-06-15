import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Usuario } from '@interfaces/usuario/usuario';


const Usuario = createFeatureSelector<Usuario>('usuario');


export const obtenerUsuarioTelefono = createSelector(
  Usuario,
  (Usuario) => {
    const telefono = Usuario.telefono || '';
    return `${telefono}`
  }
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
  (Usuario) => {
    const nombre = Usuario.nombre || '';
    const apellido = Usuario.apellido || '';
    return `${nombre} ${apellido}`;
  }
);

export const obtenerUsuarioImagen = createSelector(
  Usuario,
  (Usuario) => `${Usuario.imagen}`
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

export const obtenerUsuarioFechaLimitePago = createSelector(
  Usuario,
  (Usuario) => Usuario.fecha_limite_pago
);

export const obtenerUsuarioVrSaldo = createSelector(
  Usuario,
  (Usuario) => Usuario.vr_saldo
);

export const obtenerUsuarioSuspencion = createSelector(
  Usuario,
  (Usuario) => Usuario.vr_saldo > 0
);

export const obtenerValidacionSaldo = (saldo: number) => createSelector(
  Usuario,
  (Usuario) => Usuario.vr_saldo !== saldo
);
