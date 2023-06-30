import { Empresa } from '@interfaces/usuario/empresa';
import { createAction, props } from '@ngrx/store';

export const empresaActionInit = createAction(
  '[Empresa] informacion',
  props<{empresa: Empresa}>()
);

export const GuardarEmpresaAction = createAction(
  '[Empresa] Guardar Empresa localstore',
  props<{empresa: Empresa}>()
);

export const empresaSeleccionAction = createAction(
  '[Empresa] Seleccionar Empresa',
  props<{ seleccion: boolean }>()
);
