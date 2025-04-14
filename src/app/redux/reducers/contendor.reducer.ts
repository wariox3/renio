import { cookieKey } from '@comun/services/domain/enums/cookie-key.enum';
import { Contenedor, RespuestaConectar } from '@interfaces/usuario/contenedor';
import { createReducer, on } from '@ngrx/store';
import { getCookie } from 'typescript-cookie';
import {
  ContenedorActionActualizarImagen,
  ContenedorActionBorrarInformacion,
  ContenedorActionInit,
  ContenedorSeleccionAction,
} from '../actions/contenedor.actions';

let contenedorDatos = getCookie(cookieKey.CONTENEDOR);

let estadoInicializado: Contenedor = {
  id: 0,
  usuario_id: 0,
  contenedor_id: 0,
  rol: '',
  subdominio: '',
  nombre: '',
  imagen: '',
  usuarios: 0,
  usuarios_base: 0,
  plan_id: 0,
  plan_nombre: '',
  reddoc: true,
  ruteo: false,
  acceso_restringido: false,
  seleccion: false
};

export const initialState: Contenedor = contenedorDatos
  ? JSON.parse(contenedorDatos)
  : estadoInicializado;

export const contendorReducer = createReducer(
  initialState,
  on(ContenedorActionInit, (state, { contenedor }) => {
    return {
      ...state,
      ...contenedor,
    };
  }),
  on(ContenedorSeleccionAction, (state, { seleccion }) => {
    return {
      ...state,
      seleccion: seleccion,
    };
  }),
  on(ContenedorActionBorrarInformacion, (state) => {
    return {
      ...state,
      ...{
        id: 0,
        usuario_id: 0,
        contenedor_id: 0,
        rol: '',
        subdominio: '',
        nombre: '',
        imagen: '',
        usuarios: 0,
        usuarios_base: 0,
        plan_id: 0,
        plan_nombre: '',
        reddoc: true,
        ruteo: false,
        acceso_restringido: false,
      },
    };
  }),
  on(ContenedorActionActualizarImagen, (state, { imagen }) => {
    return {
      ...state,
      imagen,
    };
  }),
);
