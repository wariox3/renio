import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Menu } from "../reducers/menu.reducer";

const MenuInformacion = createFeatureSelector<Menu>('menu')


export const obtenerMenuInformacion = createSelector(
  MenuInformacion,
  (MenuInformacion) => MenuInformacion.informacion
);

