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
    path: 'especial',
    children: [
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
    ],
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
    path: 'informe',
    children: [
      {
        path: 'balance_prueba',
        loadComponent: () =>
          import(
            './paginas/informes/balance-prueba/balance-prueba.component'
          ).then((c) => c.BalancePruebaComponent),
      },
      {
        path: 'balance_prueba_contacto',
        loadComponent: () =>
          import(
            './paginas/informes/balance-prueba-contacto/balance-prueba-contacto.component'
          ).then((c) => c.BalancePruebaContactoComponent),
      },
      {
        path: 'auxiliar_cuenta',
        loadComponent: () =>
          import(
            './paginas/informes/auxiliar-cuenta/auxiliar-cuenta.component'
          ).then((c) => c.AuxiliarCuentaComponent),
      },
      {
        path: 'auxiliar_tercero',
        loadComponent: () =>
          import(
            './paginas/informes/auxiliar-tercero/auxiliar-tercero.component'
          ).then((c) => c.AuxiliarTerceroComponent),
      },
      {
        path: 'auxiliar_general',
        loadComponent: () =>
          import(
            './paginas/informes/auxiliar-general/auxiliar-general.component'
          ).then((c) => c.AxiliarGeneralComponent),
      },
      {
        path: 'base',
        loadComponent: () =>
          import('./paginas/informes/base/base.component').then(
            (c) => c.BaseComponent,
          ),
      },
      {
        path: 'certificado_retencion',
        loadComponent: () =>
          import(
            './paginas/informes/certificado-retencion/certificado-retencion.component'
          ).then((c) => c.CertificadoRetencionComponent),
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
