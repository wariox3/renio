import { AplicacionModulo } from '@comun/type/aplicacion-modulo.type';
import { MenuItem } from '@interfaces/menu/menu';
import { createFeatureSelector, createSelector } from '@ngrx/store';

const Menu = createFeatureSelector<MenuItem>('menu');

export const obtenerMenuSeleccion = createSelector(
  Menu,
  (Menu) => `${Menu.seleccion}`,
);

export const obtenerMenuInformacion = createSelector(
  Menu,
  (Menu) => Menu.informacion,
);

export const obtenerMenuDataMapeo = createSelector(
  Menu,
  (Menu) => Menu.dataMapeo,
);

export const obtenerMenuModulos = (plan_id: number) =>
  createSelector(Menu, (Menu) => {
    switch (plan_id) {
      case 8:
      case 6:
        return Menu.modulos;
      case 4:
        return Menu.modulos.filter(
          (menu: AplicacionModulo) => menu !== 'humano',
        );
      case 2:
        return Menu.modulos.filter(
          (menu: AplicacionModulo) =>
            menu !== 'humano' &&
            menu !== 'contabilidad' &&
            menu !== 'inventario',
        );
      default:
        return Menu.modulos.filter(
          (menu: AplicacionModulo) => menu === 'venta',
        );
    }
  });

export const obtenerMenuDataMapeoCamposVisibleTabla = createSelector(
  Menu,
  (Menu) =>
    Menu.dataMapeo?.filter((titulo: any) => titulo.visibleTabla === true),
);

export const obtenerMenuDataMapeoCamposVisibleFiltros = createSelector(
  Menu,
  (Menu) => {
    return Menu?.dataMapeo?.filter(
      (titulo: any) => titulo.visibleFiltro === true,
    );
  },
);

export const obtenerMenuDataMapeoBuscarCampo = (valorBusqueda: string) =>
  createSelector(Menu, (Menu) =>
    Menu.dataMapeo.filter((titulo: any) =>
      titulo.nombre.toLowerCase().includes(valorBusqueda),
    ),
  );

export const obtenerMenuDataMapeoVisualizarTodo = createSelector(Menu, (Menu) =>
  Menu.dataMapeo.filter((titulo: any) => titulo.visibleFiltro === true),
);
