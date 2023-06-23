import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Menu } from "../reducers/menu.reducer";

const MenuSeleccion = createFeatureSelector<Menu>('menu')


export const obtenerMenuSeleccion = createSelector(
  MenuSeleccion,
  (MenuSeleccion) => `${MenuSeleccion.seleccion}`
);

