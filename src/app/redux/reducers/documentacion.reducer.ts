import { Documentacion } from '@interfaces/comunes/documentacion/documentacion';
import { createReducer, on } from '@ngrx/store';
import { asignarDocumentacion } from '@redux/actions/documentacion.actions';

export const initialState: Documentacion = {
  id: localStorage.getItem('documentacion')
    ? JSON.parse(localStorage.getItem('documentacion') || '{}').id || 0
    : 0,
  nombre: localStorage.getItem('documentacion')
    ? JSON.parse(localStorage.getItem('documentacion') || '{}').nombre || ''
    : '',
};
export const documentacionReducer = createReducer(
  initialState,
  on(asignarDocumentacion, (state, { id, nombre }) => ({
    ...state,
    id,
    nombre,
  }))
);
