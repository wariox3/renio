import { createReducer, on } from '@ngrx/store';
import { empresaActionInit } from '@redux/actions/empresa.actions';

const initialState = {
  nombre: "",
  imagen: ""
}

export const empresaReducer = createReducer(
  initialState,
  on(empresaActionInit, (state, { empresa }) => ({
    ...state,
    empresa,
  }))
);
