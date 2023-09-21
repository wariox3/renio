import { createReducer, on } from '@ngrx/store';
import {
  InquilinoActionInit,
  InquilinoSeleccionAction,
} from '../actions/inquilino.actions';
import { Inquilino } from '@interfaces/usuario/inquilino';
import { getCookie } from 'typescript-cookie';

let dominioActual = window.location.host;

let InquilinoDatos = getCookie(`empresa-${dominioActual.split('.')[0]}`);
let estadoAnalizado: Inquilino = {
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

export const initialState: Inquilino = InquilinoDatos
  ? JSON.parse(InquilinoDatos)
  : estadoAnalizado;

export const inquilinoReducer = createReducer(
  initialState,
  on(InquilinoActionInit, (state, { inquilino }) => {
    return {
      ...state,
      ...inquilino,
    };
  }),
  on(InquilinoSeleccionAction, (state, { seleccion }) => {
    return {
      ...state,
      seleccion: seleccion,
    };
  })
);
