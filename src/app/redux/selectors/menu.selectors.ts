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

export const obtenerMenuModulos = (plan_id: number) => createSelector(
  Menu,
  (Menu) =>  {
    switch (plan_id) {
      case 8:
      case 4:
      case 6:
          return Menu.modulos
      case 2:
        return Menu.modulos.filter((menu:string)=> menu !== 'HUMANO')
      default:
        return Menu.modulos.filter((menu:string)=> menu === 'VENTA')
    }
  }
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
