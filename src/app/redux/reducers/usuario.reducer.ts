import { createReducer, on } from '@ngrx/store';
import {
  usuarioActionInit,
  usuarioActionBorrarInformacion,
  usuarioActionActualizarNombreCorto,
  usuarioActionActualizarInformacionUsuario,
  usuarioActionActualizarIdioma,
  usuarioActionActualizarImagen,
  usuarioActionActualizarVrSaldo,
  usuarioActionActualizarEstadoVerificado,
} from '../actions/usuario.actions';
import { getCookie } from 'typescript-cookie';
import { Usuario } from '@interfaces/usuario/usuario';

let usuarioData = getCookie('usuario');

let parsedState: Usuario = {
  id: 0,
  username: '',
  imagen: '',
  nombre_corto: '',
  nombre: '',
  apellido: '',
  telefono: '',
  correo: '',
  idioma: '',
  dominio: '',
  fecha_limite_pago: new Date(),
  vr_saldo: 0,
  fecha_creacion: new Date(),
  verificado: false,
  es_socio: false,
  socio_id: '',
  is_active: false,
  numero_identificacion: '',
  cargo: ''
};

export const initialState: Usuario = usuarioData
  ? JSON.parse(usuarioData)
  : parsedState;

export const usuarioReducer = createReducer(
  initialState,
  on(usuarioActionInit, (state, { usuario }) => {
    return {
      ...state,
      ...usuario,
    };
  }),
  on(usuarioActionActualizarNombreCorto, (state, { nombre_corto }) => {
    return {
      ...state,
      nombre_corto,
    };
  }),
  on(
    usuarioActionActualizarInformacionUsuario,
    (state, { nombre_corto, nombre, apellido, telefono, cargo, numero_identificacion }) => {
      return {
        ...state,
        nombre_corto,
        nombre,
        apellido,
        telefono,
        cargo,
        numero_identificacion
      };
    }
  ),
  on(usuarioActionActualizarIdioma, (state, { idioma }) => {
    return {
      ...state,
      idioma,
    };
  }),
  on(usuarioActionBorrarInformacion, (state) => {
    return {
      ...state,
      ...{
        id: 0,
        username: '',
      },
    };
  }),
  on(usuarioActionActualizarImagen, (state, { imagen }) => {
    return {
      ...state,
      imagen,
    };
  }),
  on(usuarioActionActualizarVrSaldo, (state, { vr_saldo }) => {
    return {
      ...state,
      vr_saldo,
    };
  }),
  on(usuarioActionActualizarEstadoVerificado, (state, { estado_verificado }) => {
    return {
      ...state,
      estado_verificado,
    };
  })
);
