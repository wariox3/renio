import { createReducer, on } from '@ngrx/store';
import {
  empresaActionInit,
  empresaSeleccionAction,
} from '../actions/empresa.actions';
import { Empresa } from '@interfaces/usuario/empresa';
import { getCookie } from 'typescript-cookie';

let dominioActual = window.location.host;

let empresaData = getCookie(`empresa-${dominioActual.split('.')[0]}`);
let estadoAnalizado: Empresa = {
  nombre: '',
  imagen: '',
  inquilino_id: 0,
  id: 0,
  subdominio: '',
  usuario_id: 0,
  seleccion: false,
  rol: '',
  plan_id: null,
  plan_nombre: null,
  usuarios: 1,
  usuarios_base: 0,
  ciudad: 0,
  correo: '',
  direccion: '',
  identificacion: 0,
  nombre_corto: '',
  numero_identificacion: 0,
  telefono: ''
};

export const initialState: Empresa = empresaData
  ? JSON.parse(empresaData)
  : estadoAnalizado;

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
