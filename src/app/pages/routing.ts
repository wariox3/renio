import { Routes } from '@angular/router';
import { validarRutaGuard } from '@guardias/validar-ruta.guard';

const Routing: Routes = [
  {
    path: 'general',
    canActivate: [validarRutaGuard],
    data: { breadcrumb: 'general' },
    loadChildren: () =>
      import('../modules/general/general-routing').then((m) => m.routes),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('../modules/profile/profile.module').then((m) => m.ProfileModule),
    data: { layout: 'dark-header' },
  },
  {
    path: 'cartera',
    data: { breadcrumb: 'cartera' },
    canActivateChild: [validarRutaGuard],
    loadChildren: () =>
      import('../modules/cartera/cartera-routing').then((r) => r.routes),
  },
  {
    path: 'compra',
    data: { breadcrumb: 'compra' },
    canActivateChild: [validarRutaGuard],
    loadChildren: () =>
      import('../modules/compra/compra-routing').then((r) => r.routes),
  },
  {
    path: 'contabilidad',
    data: { breadcrumb: 'contabilidad' },
    canActivateChild: [validarRutaGuard],
    loadChildren: () =>
      import('../modules/contabilidad/contabilidad-routing').then(
        (r) => r.routes,
      ),
  },
  {
    path: 'humano',
    data: { breadcrumb: 'humano' },
    canActivateChild: [validarRutaGuard],
    loadChildren: () =>
      import('../modules/humano/humano-routing').then((r) => r.routes),
  },
  {
    path: 'venta',
    data: { breadcrumb: 'venta' },
    canActivateChild: [validarRutaGuard],
    loadChildren: () =>
      import('../modules/venta/venta.routes').then((r) => r.routes),
  },
  {
    path: 'inventario',
    data: { breadcrumb: 'inventario' },
    canActivateChild: [validarRutaGuard],
    loadChildren: () =>
      import('../modules/inventario/inventario.routes').then((m) => m.routes),
  },
  {
    path: 'tesoreria',
    data: { breadcrumb: 'tesoreria' },
    canActivateChild: [validarRutaGuard],
    loadChildren: () =>
      import('../modules/tesoreria/tesoreria-routing').then((r) => r.routes),
  },
  {
    path: 'contenedor',
    loadChildren: () =>
      import('../modules/contenedor/contenedor-routing').then((r) => r.routes),
    data: { layout: 'dark-header' },
  },
  {
    path: 'empresa',
    loadChildren: () =>
      import('../modules/empresa/empresa-routing').then((r) => r.routes),
    data: { layout: 'dark-header' },
  },
  {
    path: 'seguridad',
    loadChildren: () =>
      import('../modules/seguridad/seguridad-routing').then((r) => r.routes),
    data: { layout: 'dark-header' },
  },
  {
    path: 'facturacion',
    loadChildren: () =>
      import('../modules/facturacion/facturacion-routing').then(
        (r) => r.routes,
      ),
    data: { layout: 'dark-header' },
  },
  {
    path: 'socio',
    loadChildren: () =>
      import('../modules/socio/socio-routing').then((r) => r.routes),
    data: { layout: 'dark-header' },
  },
  {
    path: 'transporte',
    canActivateChild: [validarRutaGuard],
    loadChildren: () =>
      import('../modules/transporte/transporte-routing').then((r) => r.routes),
  },
  {
    path: 'estado',
    loadComponent: () =>
      import(
        '../comun/componentes/facturacion-mensaje-pago/facturacion-mensaje-pago.component'
      ).then((c) => c.FacturacionMensajePagoComponent),
    data: { layout: 'dark-header' },
  },
  {
    path: 'laboratorio',
    children: [
      {
        path: 'graficas',
        loadComponent: () =>
          import('../comun/componentes/laboratorio/laboratorio.component').then(
            (c) => c.LaboratorioComponent,
          ),
      },
    ],
    data: { layout: 'dark-header' },
  },
];

export { Routing };
