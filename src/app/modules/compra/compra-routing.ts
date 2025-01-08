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
        path: 'cuentas_pagar',
        loadComponent: () =>
          import(
            '../tesoreria/paginas/informe/cuentas-pagar/cuentas-pagar.component'
          ).then((c) => c.CuentasPagarComponent),
      },
    ],
  },
  {
    path: 'utilidad',
    children: [
      {
        path: 'documento_electronico',
        loadComponent: () =>
          import(
            './paginas/utilidades/documento-electronico/documento-electronico.component'
          ).then((c) => c.DocumentoElectronicoComponent),
      },
      {
        path: 'eventos_dian',
        loadComponent: () =>
          import(
            './paginas/utilidades/eventos-dian/eventos-dian.component'
          ).then((c) => c.EventosDianComponent),
      },
    ],
  },
  {
    path: 'informe',
    loadChildren: () =>
      import('../../pages/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];
