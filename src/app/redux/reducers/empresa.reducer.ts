import { environment } from '@env/environment';
import { Empresa } from '@interfaces/contenedor/empresa';
import { createReducer, on } from '@ngrx/store';
import {
  empresaActionInit,
  empresaActualizacionAction,
  empresaActualizacionImangenAction,
  empresaLimpiarAction,
  empresaActualizacionRededocIdAction,
  empresaActualizacionAsisteneElectronico
} from '@redux/actions/empresa.actions';
import { getCookie } from 'typescript-cookie';

let ContenedorDatos: any;

if (environment.production) {
  let dominioActual = window.location.host;
  ContenedorDatos = getCookie(`empresa-${dominioActual.split('.')[0]}`);
} else {
  ContenedorDatos = getCookie(`empresa-${environment.EMPRESA_LOCALHOST}`);
}

let estadoInicializado: Empresa = {
  id: 0,
  numero_identificacion: '',
  digito_verificacion: '',
  nombre_corto: '',
  direccion: '',
  telefono: '',
  correo: '',
  imagen: '',
  ciudad: 0,
  identificacion: 0,
  identificacion_nombre: '',
  regimen: 0,
  regimen_nombre: '',
  tipo_persona: 0,
  tipo_persona_nombre: '',
  suscriptor: 0,
  ciudad_id: 0,
  identificacion_id: 0,
  rededoc_id: '',
  ciudad_nombre: '',
  asistente_electronico: false
};

const initialState: Empresa = ContenedorDatos
  ? JSON.parse(ContenedorDatos)
  : estadoInicializado;

export const empresaReducer = createReducer(
  initialState,
  on(empresaActionInit, (state, { empresa }) => ({
    ...state,
    ...empresa,
  })),
  on(empresaActualizacionAction, (state, { empresa }) => ({
    ...state,
    ...empresa,
  })),
  on(empresaActualizacionImangenAction, (state, { imagen }) => ({
    ...state,
    ...{
      imagen,
    },
  })),
  on(empresaLimpiarAction, (state) => ({
    ...state,
    ...estadoInicializado,
  })),
  on(empresaActualizacionRededocIdAction, (state, {rededoc_id}) => ({
    ...state,
    ...{
      rededoc_id,
    },
  })),
  on(empresaActualizacionAsisteneElectronico, (state, {asistente_electronico}) => ({
    ...state,
    ...{
      asistente_electronico,
    },
  })),
);
