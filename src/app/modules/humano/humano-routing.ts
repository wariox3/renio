import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'documento',
    children: [
      {
        path: 'lista',
        loadComponent: () =>
          import(
            '../../comun/componentes/base-documento/base-lista/base-lista.component'
          ).then((c) => c.BaseListaComponent),
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import(
            '../../comun/componentes/base-documento/base-nuevo/base-nuevo.component'
          ).then((c) => c.BaseNuevoComponent),
      },
      {
        path: 'editar/:id',
        loadComponent: () =>
          import(
            '../../comun/componentes/base-documento/base-nuevo/base-nuevo.component'
          ).then((c) => c.BaseNuevoComponent),
      },
      {
        path: 'detalle/:id',
        loadComponent: () =>
          import(
            '../../comun/componentes/base-documento/base-detalle/base-detalle.component'
          ).then((c) => c.BaseDetalleComponent),
      },
    ],
  },
  {
    path: 'administracion',
    children: [
      {
        path: 'lista',
        loadComponent: () =>
          import(
            '../../comun/componentes/base-administracion/base-lista/base-lista.component'
          ).then((c) => c.BaseListaComponent),
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import(
            '../../comun/componentes/base-administracion/base-nuevo/base-nuevo.component'
          ).then((c) => c.BaseNuevoComponent),
      },
      {
        path: 'editar/:id',
        loadComponent: () =>
          import(
            '../../comun/componentes/base-administracion/base-nuevo/base-nuevo.component'
          ).then((c) => c.BaseNuevoComponent),
      },
      {
        path: 'detalle/:id',
        loadComponent: () =>
          import(
            '../../comun/componentes/base-administracion/base-detalle/base-detalle.component'
          ).then((c) => c.BaseDetalleComponent),
      },
    ],
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
        path: 'nomina',
        loadComponent: () =>
          import('./paginas/informes/nomina/nomina.component').then(
            (c) => c.NominaComponent,
          ),
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
  {
    path: 'proceso',
    children: [
      {
        path: 'lista',
        loadComponent: () =>
          import(
            '../../comun/componentes/base-documento/base-lista/base-lista.component'
          ).then((c) => c.BaseListaComponent),
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import(
            '../../comun/componentes/base-documento/base-nuevo/base-nuevo.component'
          ).then((c) => c.BaseNuevoComponent),
      },
      {
        path: 'editar/:id',
        loadComponent: () =>
          import(
            '../../comun/componentes/base-documento/base-nuevo/base-nuevo.component'
          ).then((c) => c.BaseNuevoComponent),
      },
      {
        path: 'detalle/:id',
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
