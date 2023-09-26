import { Empresa } from '@interfaces/contenedor/empresa';
import { createReducer, on } from '@ngrx/store';
import { empresaActionInit, empresaActualizacionAction } from '@redux/actions/empresa.actions';

const initialState: Empresa = {
  id: 0,
  numero_identificacion: '',
  digito_verificacion: '',
  nombre_corto: '',
  direccion: '',
  telefono: '',
  correo: '',
  imagen: '',
};

export const empresaReducer = createReducer(
  initialState,
  on(empresaActionInit, (state, { empresa }) => ({
    ...state,
    ...empresa,
  })),
  on(empresaActualizacionAction, (state, {empresa})=>({
    ...state,
    ...empresa,
  }))
);
