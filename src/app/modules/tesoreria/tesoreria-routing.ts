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
    ],
  },
  {
    path: 'informe',
    children: [
      {
        path: 'cuentas_pagar',
        loadComponent: () =>
          import(
            './paginas/informe/cuentas-pagar/cuentas-pagar.component'
          ).then((c) => c.CuentasPagarComponent),
      },
    ],
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];
