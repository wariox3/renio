import { createAction, props } from '@ngrx/store';
import { Usuario } from 'src/app/interfaces/usuario/usuario';

export const usuarioActionInit = createAction(
  '[Usuario] informacion',
  props<{ usuario: Usuario }>()
);

export const usuarioActionBorrarInformacion = createAction(
  '[Usuario] borrar informacion'
);


export const usuarioActionActualizarNombreCorto = createAction(
  '[Usuario] actualizar nombre corto',
  props<{"nombre_corto": string}>()
);

export const usuarioActionActualizarInformacionUsuario = createAction(
  '[Usuario] actualizar informacion usuario',
  props<{"nombre_corto": string, "nombre": string, "apellido": string, "telefono": string, "idioma": string}>()
);


export const usuarioActionActualizarIdioma = createAction(
  '[Usuario] actualizar nombre corto',
  props<{"idioma": string}>()
);
