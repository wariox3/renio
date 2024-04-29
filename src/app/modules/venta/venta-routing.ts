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
  //   import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];
