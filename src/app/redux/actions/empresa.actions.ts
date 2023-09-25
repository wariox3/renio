import { Empresa } from '@interfaces/contenedor/empresa';
import { createAction, props } from '@ngrx/store';

export const empresaActionInit = createAction(
  '[Empresa] informacion',
  props<{empresa: Empresa}>()
);


