import { cookieKey } from '@comun/services/domain/enums/cookie-key.enum';
import { Contenedor } from '@interfaces/usuario/contenedor';
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
  nombre: '',
  imagen: '',
  contenedor_id: 0,
  id: 0,
  subdominio: '',
  usuario_id: 0,
  seleccion: false,
  rol: '',
  plan_id: 0,
  plan_nombre: null,
  usuarios: 1,
  usuarios_base: 0,
  ciudad: 0,
  correo: '',
  direccion: '',
  identificacion: 0,
  nombre_corto: '',
  numero_identificacion: 0,
  telefono: '',
  acceso_restringido: false,
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
        nombre: '',
        imagen: '',
        contenedor_id: 0,
        id: 0,
        subdominio: '',
        usuario_id: 0,
        seleccion: false,
        rol: '',
        plan_id: 0,
        plan_nombre: null,
        usuarios: 1,
        usuarios_base: 0,
        ciudad: 0,
        correo: '',
        direccion: '',
        identificacion: 0,
        nombre_corto: '',
        numero_identificacion: 0,
        telefono: '',
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
