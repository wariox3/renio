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
        path: 'nomina',
        loadComponent: () =>
          import(
            './paginas/informes/nomina/nomina.component'
          ).then((c) => c.NominaComponent),
      },
      {
        path: 'nomina_detalle',
        loadComponent: () =>
          import(
            './paginas/informes/nomina-detalle/nomina-detalle.component'
          ).then((c) => c.NominaDetalleComponent),
      },
      {
        path: 'nomina_electronica',
        loadComponent: () =>
          import(
            './paginas/informes/nomina-electronica/nomina-electronica.component'
          ).then((c) => c.NominaElectronicaComponent),
      },
    ],
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];
