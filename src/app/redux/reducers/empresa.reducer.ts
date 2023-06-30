import { createReducer, on } from '@ngrx/store';
import {
  empresaActionInit,
  empresaSeleccionAction
} from '../actions/empresa.actions';
import { Empresa } from '@interfaces/usuario/empresa';
import { getCookie } from 'typescript-cookie';


let empresaData = getCookie('empresa');
let estadoAnalizado: Empresa =  {
  nombre: "",
  imagen: "",
  empresa_id: 0,
  id: 0,
  subdominio: "",
  usuario_id: 0,
  seleccion: false
};


export const initialState: Empresa = empresaData ? JSON.parse(empresaData) : estadoAnalizado;

export const empresaReducer = createReducer(
  initialState,
  on(empresaActionInit, (state, { empresa }) => {
    return {
      ...state,
      ...empresa,
    };
  }),
  on(empresaSeleccionAction, (state, { seleccion }) => {
    return {
      ...state,
      seleccion: seleccion,
    };
  })
);
