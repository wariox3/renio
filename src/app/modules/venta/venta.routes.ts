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
    data: { breadcrumb: 'documento' },
    children: [
      {
        path: 'lista',
        data: { breadcrumb: 'query:modelo' },
        loadComponent: () =>
          import(
            '../../comun/componentes/base-documento/base-lista/base-lista.component'
          ).then((c) => c.BaseListaComponent),
      },
      {
        path: 'nuevo',
        data: { breadcrumb: 'query:modelo' },
        loadComponent: () =>
          import(
            '../../comun/componentes/base-documento/base-nuevo/base-nuevo.component'
          ).then((c) => c.BaseNuevoComponent),
      },
      {
        path: 'editar/:id',
        data: { breadcrumb: 'query:modelo' },
        loadComponent: () =>
          import(
            '../../comun/componentes/base-documento/base-nuevo/base-nuevo.component'
          ).then((c) => c.BaseNuevoComponent),
      },
      {
        path: 'detalle/:id',
        data: { breadcrumb: 'query:modelo' },
        loadComponent: () =>
          import(
            '../../comun/componentes/base-documento/base-detalle/base-detalle.component'
          ).then((c) => c.BaseDetalleComponent),
      },
    ],
  },
  {
    path: 'administracion',
    data: { breadcrumb: 'administración' },
    children: [
      {
        path: 'lista',
        data: { breadcrumb: 'query:modelo' },
        loadComponent: () =>
          import(
            '../../comun/componentes/base-administracion/base-lista/base-lista.component'
          ).then((c) => c.BaseListaComponent),
      },
      {
        path: 'nuevo',
        data: { breadcrumb: 'query:modelo' },
        loadComponent: () =>
          import(
            '../../comun/componentes/base-administracion/base-nuevo/base-nuevo.component'
          ).then((c) => c.BaseNuevoComponent),
      },
      {
        path: 'editar/:id',
        data: { breadcrumb: 'query:modelo' },
        loadComponent: () =>
          import(
            '../../comun/componentes/base-administracion/base-nuevo/base-nuevo.component'
          ).then((c) => c.BaseNuevoComponent),
      },
      {
        path: 'detalle/:id',
        data: { breadcrumb: 'query:modelo' },
        loadComponent: () =>
          import(
            '../../comun/componentes/base-administracion/base-detalle/base-detalle.component'
          ).then((c) => c.BaseDetalleComponent),
      },
    ],
  },
  {
    path: 'utilidad',
    data: { breadcrumb: 'utilidad' },
    children: [
      {
        path: 'factura_electronica',
        data: { breadcrumb: 'enviarfacturaelectronica' },
        loadComponent: () =>
          import(
            './paginas/utilidades/factura-electronica/factura-electronica.component'
          ).then((c) => c.FacturaElectronicaComponent),
      },
    ],
  },
  {
    path: 'informe',
    data: { breadcrumb: 'informe' },
    children: [
      {
        path: 'ventas_general',
        data: { breadcrumb: 'query:modelo' },
        loadComponent: () =>
          import(
            './paginas/utilidades/factura-electronica/factura-electronica.component'
          ).then((c) => c.FacturaElectronicaComponent),
      },
      {
        path: 'ventas_items',
        data: { breadcrumb: 'ventasitems' },
        loadComponent: () =>
          import(
            './paginas/informes/ventas-items/ventas-items.component'
          ).then((c) => c.VentasItemsComponent),
      },
      {
        path: 'cuentas_cobrar',
        data: { breadcrumb: 'cuentascobrar' },
        loadComponent: () =>
          import(
            '../cartera/paginas/informe/cuentas-cobrar/cuentas-cobrar.component'
          ).then((c) => c.CuentasCobrarComponent),
      },
      {
        path: 'ventas_cliente',
        data: { breadcrumb: 'query:modelo' },
        loadComponent: () =>
          import(
            './paginas/utilidades/factura-electronica/factura-electronica.component'
          ).then((c) => c.FacturaElectronicaComponent),
      },
      {
        path: 'ventas_vendedores',
        data: { breadcrumb: 'query:modelo' },
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
