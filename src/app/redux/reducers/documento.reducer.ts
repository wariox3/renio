import { environment } from '@env/environment';
import { createReducer, on } from '@ngrx/store';
import { documentosEstadosAction } from '@redux/actions/documentos-estados.actions';
import { getCookie } from 'typescript-cookie';

let documentosEstados: any;

if (environment.production) {
  let dominioActual = window.location.host;
  documentosEstados = getCookie(`documento-${dominioActual.split('.')[0]}`);
} else {
  documentosEstados = getCookie(`documento-${environment.EMPRESA_LOCALHOST}`);
}

export const initialState = documentosEstados
  ? JSON.parse(documentosEstados)
  : documentosEstados;

export const documentoReducer = createReducer(
  initialState,
  on(documentosEstadosAction, (state, { estados }) => {
    return {
      ...state,
      estados: estados,
    };
  })
);
