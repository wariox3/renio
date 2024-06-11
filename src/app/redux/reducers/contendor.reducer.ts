import { createReducer, on } from '@ngrx/store';
import {
  ContenedorActionInit,
  ContenedorSeleccionAction,
} from '../actions/contenedor.actions';
import { Contenedor } from '@interfaces/usuario/contenedor';
import { getCookie } from 'typescript-cookie';
import { environment } from '@env/environment';

let contenedorDatos: any;

if (environment.production) {
  let dominioActual = window.location.host;
  contenedorDatos = getCookie(`contenedor-${dominioActual.split('.')[0]}`);
} else {
  contenedorDatos = getCookie(`contenedor-${environment.EMPRESA_LOCALHOST}`);
}


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
  telefono: ''
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
  })
);
