import { ArchivoImportacion } from '@interfaces/comunes/importar/archivo-importacion';
import { createReducer, on } from '@ngrx/store';
import { asignarArchivoImportacionDetalle, asignarArchivoImportacionLista, asignarArchivoImportacionNuevo } from '@redux/actions/archivo-importacion.actions';

export const initialState: ArchivoImportacion =  {
  lista: null,
  detalle: null,
  nuevo: null
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
