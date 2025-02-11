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
    path: 'movimiento',
    loadComponent: () =>
      import(
        './paginas/independientes/movimiento/movimiento-lista/movimiento-lista.component'
      ).then((c) => c.MovimientoListaComponent),
  },
  {
    path: 'periodo',
    loadComponent: () =>
      import(
        './paginas/independientes/periodo/periodo-detalle/periodo-detalle.component'
      ).then((c) => c.PeriodoDetalleComponent),
  },
  {
    path: 'informe',
    children: [
      {
        path: 'balance_prueba',
        loadComponent: () =>
          import(
            './paginas/informes/balance-prueba/balance-prueba.component'
          ).then((c) => c.BalancePruebaComponent),
      },
    ],
  },
  {
    path: 'utilidad',
    children: [
      {
        path: 'contabilizar',
        loadComponent: () =>
          import('./paginas/utilidades/contabilizar/contabilizar.component'),
      },
    ],
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];
