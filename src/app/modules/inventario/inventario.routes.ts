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
        (m) => m.DashboardModule,
      ),
  },
  {
    path: 'informe',
    children: [
      {
        path: 'existencia',
        loadComponent: () =>
          import('./paginas/informes/existencia/existencia.component'),
      },
      {
        path: 'historial_movimientos',
        loadComponent: () =>
          import(
            './paginas/informes/historial-movimientos/historial-movimientos.component'
          ),
      },
    ],
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];
