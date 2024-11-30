import { Documentacion } from '@interfaces/comunes/documentacion';
import { createReducer, on } from '@ngrx/store';
import { asignarDocumentacionId } from '@redux/actions/documentacion.actions';


export const initialState: Documentacion = {
  id: localStorage.getItem('documentacionId')
    ? parseInt(localStorage.getItem('documentacionId') || '0', 10)
    : 0,
};

export const documentacionReducer = createReducer(
  initialState,
  on(asignarDocumentacionId, (state, { id }) => ({
    ...state,
    id,
  }))
);
