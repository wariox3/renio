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

export const obtenerMenuDataMapeo = createSelector(
  Menu,
  (Menu) => Menu.dataMapeo
);

export const obtenerMenuModulos = createSelector(
  Menu,
  (Menu) => Menu.modulos
);

export const obtenerMenuDataMapeoCamposVisibleTabla = createSelector(
  Menu,
  (Menu) => Menu.dataMapeo.filter((titulo: any) => titulo.visibleTabla === true)
);

export const obtenerMenuDataMapeoCamposVisibleFiltros = createSelector(
  Menu,
  (Menu) => Menu.dataMapeo.filter((titulo: any) => titulo.visibleFiltro === true)
);

export const obtenerMenuDataMapeoBuscarCampo = (valorBusqueda: string) => createSelector(
  Menu,
  (Menu) => Menu.dataMapeo.filter((titulo: any) => titulo.nombre.toLowerCase().includes(valorBusqueda))
);

export const obtenerMenuDataMapeoVisualizarTodo = createSelector(
  Menu,
  (Menu) => Menu.dataMapeo.filter((titulo: any) => titulo.visibleFiltro === true)
);
