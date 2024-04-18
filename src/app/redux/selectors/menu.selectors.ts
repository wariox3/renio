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

export const obtenerMenuDataMapeoCamposVisibleTabla = createSelector(
  Menu,
  (Menu) => Menu.dataMapeo.filter((titulo: any) => titulo.visibleTabla === true)
);

export const obtenerMenuDataMapeoColumnasVisibleTabla = createSelector(
  Menu,
  (Menu) => Menu.dataMapeo.filter((titulo: any) => titulo.visibleColumna === true)
);
