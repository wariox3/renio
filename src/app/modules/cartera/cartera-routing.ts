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
            './componentes/informe/cuentas-cobrar/cuentas-cobrar.component'
          ).then((c) => c.CuentasCobrarComponent),
      },
    ],
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];
