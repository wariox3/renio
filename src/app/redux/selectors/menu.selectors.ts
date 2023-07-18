import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Menu } from "../reducers/menu.reducer";

const Menu = createFeatureSelector<Menu>('menu')


export const obtenerMenuSeleccion = createSelector(
  Menu,
  (Menu) => `${Menu.seleccion}`
);

export const obtenerMenuInformacion = createSelector(
  Menu,
  (Menu) => Menu.informacion
);
