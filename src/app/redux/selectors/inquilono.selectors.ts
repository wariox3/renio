import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Inquilino } from '@interfaces/usuario/inquilino';

const Inquilino = createFeatureSelector<Inquilino>('inquilino');

export const obtenerInquilinoSeleccion = createSelector(
  Inquilino,
  (inquilinoSeleccion) => inquilinoSeleccion.seleccion
);

export const obtenerInquilinoNombre = createSelector(
  Inquilino,
  (Inquilino) => `${Inquilino.nombre}`
);

export const obtenerLogoInquilino = createSelector(
  Inquilino,
  (Inquilino) => `${Inquilino.imagen}`
);

export const obtenerInquilinoId = createSelector(
  Inquilino,
  (Inquilino) => `${Inquilino.id}`
);


export const obtenerInquilinoSubdominio = createSelector(
  Inquilino,
  (Inquilino) => `${Inquilino.subdominio}`
);
