import { Modulos } from '@interfaces/usuario/contenedor';
import { createFeatureSelector, createSelector } from '@ngrx/store';

const modules = createFeatureSelector<Modulos>('modulosManager');

export const selectModulosHabilitados = createSelector(modules, (modules) => {
  if (!modules) return [];

  return [
    { name: 'venta', enabled: modules.plan_venta },
    { name: 'compra', enabled: modules.plan_compra },
    { name: 'tesoreria', enabled: modules.plan_tesoreria },
    { name: 'cartera', enabled: modules.plan_cartera },
    { name: 'inventario', enabled: modules.plan_inventario },
    { name: 'humano', enabled: modules.plan_humano },
    { name: 'contabilidad', enabled: modules.plan_contabilidad },
  ]
    .filter((module) => module.enabled)
    .map((module) => module.name);
});
