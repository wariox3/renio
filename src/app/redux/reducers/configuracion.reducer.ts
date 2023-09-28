import { createReducer, on } from '@ngrx/store';
import { getCookie } from 'typescript-cookie';
import { environment } from '@env/environment';
import {
  configuracionVisualizarAction,
  configutacionActionInit,
} from '@redux/actions/configuracion.actions';

let contenedorDatos: any;

contenedorDatos = getCookie(`configuracion`);

let estadoInicializado = {
  visualizarApps: false,
};

export const initialState = contenedorDatos
  ? JSON.parse(contenedorDatos)
  : estadoInicializado;

export const configuracionReducer = createReducer(
  initialState,
  on(configutacionActionInit, (state, { configuracion }) => {
    return {
      ...state,
      ...configuracion,
    };
  }),
  on(configuracionVisualizarAction, (state, { configuracion }) => {
    return {
      ...state,
      ...{
        visualizarApps: configuracion.visualizarApps,
      },
    };
  })
);
