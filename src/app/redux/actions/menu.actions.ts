import { informacionMenuItem } from '@interfaces/menu/menu';
import { createAction, props } from '@ngrx/store';

export const selecionModuloAction = createAction(
  '[Menu] Actualizar Selección',
  props<{ seleccion: string }>()
);

export const ActualizarMapeo = createAction(
  '[Menu] Actualizar mapeo',
  props<{ dataMapeo: any }>()
);

export const ActualizarCampoMapeo = createAction(
  '[Menu] Actualizar campo mapeo',
  props<{ dataMapeo: any }>()
);

export const ActualizarDataItem = createAction(
  '[Menu] Actualizar data mapeo',
  props<{ dataItem: informacionMenuItem }>()
);
