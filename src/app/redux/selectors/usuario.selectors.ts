import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Usuario } from '@interfaces/usuario/usuario';

const Usuario = createFeatureSelector<Usuario>('usuario');

export const obtenerUsuarioTelefono = createSelector(Usuario, (Usuario) => {
  const telefono = Usuario.telefono || '';
  return `${telefono}`;
});

export const obtenerUsuarioUserName = createSelector(
  Usuario,
  (Usuario) => Usuario.username
);

export const obtenerUsuarioNombre = createSelector(
  Usuario,
  (Usuario) => Usuario.nombre
);

export const obtenerUsuarioNombreCorto = createSelector(
  Usuario,
  (Usuario) => Usuario.nombre_corto
);

export const obtenerUsuarioApellido = createSelector(
  Usuario,
  (Usuario) => Usuario.apellido
);

export const obtenerUsuarioNumeroIdentificacion = createSelector(
  Usuario,
  (Usuario) => Usuario.numero_identificacion
);

export const obtenerUsuarioCargo = createSelector(
  Usuario,
  (Usuario) => Usuario.cargo
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
  (Usuario) => Usuario.imagen_thumbnail
);

export const obtenerUsuarioidioma = createSelector(
  Usuario,
  (Usuario) => `${Usuario.idioma}`
);

export const obtenerUsuarioId = createSelector(
  Usuario,
  (Usuario) => Usuario.id
);

export const obtenerUsuarioFechaLimitePago = createSelector(
  Usuario,
  (Usuario) => Usuario.fecha_limite_pago
);

export const obtenerUsuarioVrSaldo = createSelector(
  Usuario,
  (Usuario) => Usuario.vr_saldo
);

export const obtenerUsuarioVrcredito = createSelector(
  Usuario,
  (Usuario) => Usuario.vr_credito
);

export const obtenerUsuarioVrAbono = createSelector(
  Usuario,
  (Usuario) => Usuario.vr_abono
);

export const obtenerUsuarioSuspencion = createSelector(
  Usuario,
  (Usuario) => Usuario.vr_saldo > 0
);

export const obtenerUsuarioCorreo = createSelector(
  Usuario,
  (Usuario) => Usuario.correo
);

export const obtenerValidacionSaldo = (saldo: number) =>
  createSelector(Usuario, (Usuario) => Usuario.vr_saldo !== saldo);

export const obtenerUsuarioVerificado = createSelector(
  Usuario,
  (Usuario) => Usuario.verificado
);

export const obtenerUsuarioFechaCreacion = createSelector(
  Usuario,
  (Usuario) => Usuario.fecha_creacion
);

export const obtenerUsuarioSocio = createSelector(
  Usuario,
  (Usuario) => Usuario.es_socio
);

export const obtenerUsuarioSocioId = createSelector(
  Usuario,
  (Usuario) => Usuario.socio_id
);
