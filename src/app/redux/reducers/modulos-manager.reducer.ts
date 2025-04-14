import { cookieKey } from '@comun/services/domain/enums/cookie-key.enum';
import { Modulos } from '@interfaces/usuario/contenedor';
import { createReducer, on } from '@ngrx/store';
import { ModulosManagerInit } from '@redux/actions/modulos-manager.action';
import { getCookie } from 'typescript-cookie';

const modulosLocalStorage = getCookie(cookieKey.MODULOS);

let modulosInitState: Modulos = {
  plan_venta: false,
  plan_compra: false,
  plan_tesoreria: false,
  plan_cartera: false,
  plan_inventario: false,
  plan_humano: false,
  plan_contabilidad: false,
};

modulosInitState = modulosLocalStorage
  ? JSON.parse(modulosLocalStorage)
  : modulosInitState;

export const modulosManagerReducer = createReducer(
  modulosInitState,
  on(ModulosManagerInit, (state, { modulos }) => ({
    ...state,
    ...modulos,
  })),
);
