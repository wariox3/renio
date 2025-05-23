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
    path: 'informe',
    data: { breadcrumb: 'informe' },
    children: [
      {
        path: 'cuentas_pagar',
        data: { breadcrumb: 'cuentaspagar' },
        loadComponent: () =>
          import(
            '../tesoreria/paginas/informe/cuentas-pagar/cuentas-pagar.component'
          ).then((c) => c.CuentasPagarComponent),
      },
    ],
  },
  {
    path: 'utilidad',
    data: { breadcrumb: 'utilidad' },
    children: [
      {
        path: 'documento_electronico',
        data: { breadcrumb: 'documentoelectronico' },
        loadComponent: () =>
          import(
            './paginas/utilidades/documento-electronico/documento-electronico.component'
          ).then((c) => c.DocumentoElectronicoComponent),
      },
      {
        path: 'eventos_dian',
        data: { breadcrumb: 'eventosdian' },
        loadComponent: () =>
          import(
            './paginas/utilidades/eventos-dian/eventos-dian.component'
          ).then((c) => c.EventosDianComponent),
      },
    ],
  },
  {
    path: 'informe',
    data: { breadcrumb: 'informe' },
    loadChildren: () =>
      import('../../pages/dashboard/dashboard.module').then(
        (m) => m.DashboardModule,
      ),
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];
