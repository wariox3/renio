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
  props<{ nombre_corto: string }>()
);

export const usuarioActionActualizarInformacionUsuario = createAction(
  '[Usuario] actualizar informacion usuario',
  props<{
    nombre_corto: string;
    nombre: string;
    apellido: string;
    telefono: string;
    idioma: string;
    cargo: string;
    numero_identificacion: string;
  }>()
);

export const usuarioActionActualizarIdioma = createAction(
  '[Usuario] actualizar idioma',
  props<{ idioma: string }>()
);

export const usuarioActionActualizarImagen = createAction(
  '[Usuario] actualizar imagen',
  props<{ imagen: string }>()
);

export const usuarioActionActualizarVrSaldo = createAction(
  '[Usuario] actualizar vr saldo',
  props<{ vr_saldo: number }>()
);

export const usuarioActionActualizarEstadoVerificado = createAction(
  '[Usuario] actualizar estado verificado',
  props<{ estado_verificado: boolean }>()
);
