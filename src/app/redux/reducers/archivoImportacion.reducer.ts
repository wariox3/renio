import { ArchivoImportacion } from '@interfaces/comunes/archivo-importacion';
import { createReducer, on } from '@ngrx/store';
import { asignarArchivoImportacionDetalle, asignarArchivoImportacionLista, asignarArchivoImportacionNuevo } from '@redux/actions/archivoImportacion.actions';

export const initialState: ArchivoImportacion =  {
  lista: '',
  detalle: '',
  nuevo: ''
};

export const ArchivoImportacionReducer = createReducer(
  initialState,
  on(asignarArchivoImportacionLista, (state, { lista }) => ({
    ...state,
    lista,
  })),
  on(asignarArchivoImportacionNuevo, (state, { nuevo }) => ({
    ...state,
    nuevo,
  })),
  on(asignarArchivoImportacionDetalle, (state, { detalle }) => ({
    ...state,
    detalle,
  }))
);
