import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () =>
      import('../../pages/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'documento',
    children: [
      {
        path: 'lista',
        loadComponent: () =>
          import(
            '../../comun/componentes/base-documento/base-lista/base-lista.component'
          ).then((c) => c.BaseListaComponent),
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import(
            '../../comun/componentes/base-documento/base-nuevo/base-nuevo.component'
          ).then((c) => c.BaseNuevoComponent),
      },
      {
        path: 'editar/:id',
        loadComponent: () =>
          import(
            '../../comun/componentes/base-documento/base-nuevo/base-nuevo.component'
          ).then((c) => c.BaseNuevoComponent),
      },
      {
        path: 'detalle/:id',
        loadComponent: () =>
          import(
            '../../comun/componentes/base-documento/base-detalle/base-detalle.component'
          ).then((c) => c.BaseDetalleComponent),
      },
    ],
  },
  {
    path: 'administracion',
    children: [
      {
        path: 'lista',
        loadComponent: () =>
          import(
            '../../comun/componentes/base-administracion/base-lista/base-lista.component'
          ).then((c) => c.BaseListaComponent),
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import(
            '../../comun/componentes/base-administracion/base-nuevo/base-nuevo.component'
          ).then((c) => c.BaseNuevoComponent),
      },
      {
        path: 'editar/:id',
        loadComponent: () =>
          import(
            '../../comun/componentes/base-administracion/base-nuevo/base-nuevo.component'
          ).then((c) => c.BaseNuevoComponent),
      },
      {
        path: 'detalle/:id',
        loadComponent: () =>
          import(
            '../../comun/componentes/base-administracion/base-detalle/base-detalle.component'
          ).then((c) => c.BaseDetalleComponent),
      },
    ],
  },
  {
    path: 'utilidad',
    children: [
      {
        path: 'factura_electronica',
        loadComponent: () =>
          import(
            './paginas/utilidades/factura-electronica/factura-electronica.component'
          ).then((c) => c.FacturaElectronicaComponent),
      },
    ],
  },
  {
    path: 'informe',
    children: [
      {
        path: 'ventas_general',
        loadComponent: () =>
          import(
            './paginas/utilidades/factura-electronica/factura-electronica.component'
          ).then((c) => c.FacturaElectronicaComponent),
      },
      {
        path: 'ventas_items',
        loadComponent: () =>
          import(
            './paginas/informes/ventas-items/ventas-items.component'
          ).then((c) => c.VentasItemsComponent),
      },
      {
        path: 'ventas_cliente',
        loadComponent: () =>
          import(
            './paginas/utilidades/factura-electronica/factura-electronica.component'
          ).then((c) => c.FacturaElectronicaComponent),
      },
      {
        path: 'ventas_vendedores',
        loadComponent: () =>
          import(
            './paginas/utilidades/factura-electronica/factura-electronica.component'
          ).then((c) => c.FacturaElectronicaComponent),
      },
    ],
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];
