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
    data: { breadcrumb: 'informe' },
    children: [
      {
        path: 'existencia',
        data: { breadcrumb: 'existencia' },
        loadComponent: () =>
          import('./paginas/informes/existencia/existencia.component'),
      },
      {
        path: 'historial_movimientos',
        data: { breadcrumb: 'historialmovimientos' },
        loadComponent: () =>
          import(
            './paginas/informes/historial-movimientos/historial-movimientos.component'
          ),
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
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];
