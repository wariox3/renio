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
    path: 'utilidad',
    children: [
      {
        path: 'factura_electronica',
        loadComponent: () =>
          import(
            './componentes/utilidades/factura-electronica/factura-electronica.component'
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
            './componentes/utilidades/factura-electronica/factura-electronica.component'
          ).then((c) => c.FacturaElectronicaComponent),
      },
      {
        path: 'ventas_items',
        loadComponent: () =>
          import(
            './componentes/informes/ventas-items/ventas-items.component'
          ).then((c) => c.VentasItemsComponent),
      },
      {
        path: 'ventas_cliente',
        loadComponent: () =>
          import(
            './componentes/utilidades/factura-electronica/factura-electronica.component'
          ).then((c) => c.FacturaElectronicaComponent),
      },
      {
        path: 'ventas_vendedores',
        loadComponent: () =>
          import(
            './componentes/utilidades/factura-electronica/factura-electronica.component'
          ).then((c) => c.FacturaElectronicaComponent),
      },
    ],
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];
