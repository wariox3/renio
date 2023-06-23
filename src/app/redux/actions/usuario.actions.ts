import { createAction, props } from '@ngrx/store';
import { Usuario } from 'src/app/interfaces/usuario/usuario';

export const usuarioActionInit = createAction(
  '[Usuario] informacion',
  props<{ usuario: Usuario }>()
);

export const usuarioActionBorrarInformacion = createAction(
  '[Usuario] borrar informacion'
);
