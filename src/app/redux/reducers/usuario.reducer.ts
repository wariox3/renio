import { createReducer, on } from '@ngrx/store';
import {
  usuarioActionInit,
  usuarioActionBorrarInformacion,
} from '../actions/usuario.actions';
import { Usuario } from 'src/app/interfaces/usuario/usuario';
import { getCookie } from 'typescript-cookie';

let usuarioData = getCookie('usuario');

let parsedState =  {
  id: '',
  username: '',
  cargo: '',
  imgen: '',
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
