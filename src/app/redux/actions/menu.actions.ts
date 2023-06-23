import { createAction, props } from '@ngrx/store';

export const selecionModuloAction = createAction(
  '[Menu] Actualizar Selección',
      props<{seleccion: string}>()
);


