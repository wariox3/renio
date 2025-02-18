import { createReducer, on } from '@ngrx/store';
import {
  configuracionVisualizarAppsAction,
  configuracionVisualizarBreadCrumbsAction,
  configutacionActionInit,
} from '@redux/actions/configuracion.actions';
import { getCookie } from 'typescript-cookie';

let contenedorDatos: any;

contenedorDatos = getCookie(`configuracion`);

let estadoInicializado = {
  visualizarApps: false,
  visualizarBreadCrumbs: false
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
  on(configuracionVisualizarAppsAction, (state, { configuracion }) => {
    return {
      ...state,
      visualizarApps: configuracion.visualizarApps,
    };
  }),
  on(configuracionVisualizarBreadCrumbsAction, (state, { configuracion }) => {
    return {
      ...state,
      visualizarBreadCrumbs: configuracion.visualizarBreadCrumbs,
    };
  })
);
