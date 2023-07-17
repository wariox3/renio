import { createReducer, on } from '@ngrx/store';
import {
  usuarioActionInit,
  usuarioActionBorrarInformacion,
  usuarioActionActualizarNombreCorto,
  usuarioActionActualizarInformacionUsuario
} from '../actions/usuario.actions';
import { Usuario } from 'src/app/interfaces/usuario/usuario';
import { getCookie } from 'typescript-cookie';

let usuarioData = getCookie('usuario');

let parsedState:Usuario =  {
  id: '',
  username: '',
  cargo: '',
  imgen: '',
  nombre_corto: '',
  nombre: '',
  apellido: '',
  telefono: '',
  correo: '',
  idioma: ''
};


export const initialState: Usuario = usuarioData ? JSON.parse(usuarioData) : parsedState;

export const usuarioReducer = createReducer(
  initialState,
  on(usuarioActionInit, (state, { usuario }) => {
    return {
      ...state,
      ...usuario,
    };
  }),
  on(usuarioActionActualizarNombreCorto, (state, {nombre_corto})=>{
    return {
      ...state,
      nombre_corto,
    };
  }),
  on(usuarioActionActualizarInformacionUsuario, (state, {nombre_corto, nombre, apellido, telefono}) => {
    return {
      ...state,
      nombre_corto,
      nombre,
      apellido,
      telefono
    }   
  }),
  on(usuarioActionBorrarInformacion, (state) => {
    return {
      ...state,
      ...{
        id: '',
        username: '',
      },
    };
  })
);
