import { createReducer, on } from '@ngrx/store';
import {
  empresaActionInit,
} from '../actions/empresa.actions';
import { Empresa } from '@interfaces/usuario/empresa';
import { getCookie } from 'typescript-cookie';


let empresaData = getCookie('empresa');
let parsedState =  {
  nombre: "",
  logo: ""
};


export const initialState: Empresa = empresaData ? JSON.parse(empresaData) : parsedState;

export const empresaReducer = createReducer(
  initialState,
  on(empresaActionInit, (state, { empresa }) => {
    return {
      ...state,
      ...empresa,
    };
  })
);
