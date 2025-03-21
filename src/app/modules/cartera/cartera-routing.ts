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
    path: 'informe',
    children: [
      {
        path: 'cuentas_cobrar',
        loadComponent: () =>
          import(
            './paginas/informe/cuentas-cobrar/cuentas-cobrar.component'
          ).then((c) => c.CuentasCobrarComponent),
      },
      {
        path: 'cuentas_cobrar_corte',
        loadComponent: () =>
          import(
            './paginas/informe/cuentas-cobrar-corte/cuentas-cobrar-corte.component'
          ).then((c) => c.CuentasCobrarCorteComponent),
      },
    ],
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];
