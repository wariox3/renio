import { Routes } from '@angular/router';
import { ValidarPlanIdGuard } from '@guardias/validarPlanId.guard';

let redirectToValue: string = '/contenedor/lista';

function getRedirectTo(): string {
  // Aquí puedes agregar tu lógica para determinar el valor de redirección
  // basado en la variable o cualquier otra condición
  let dominioActual = window.location.host;
  let esSubdominio = dominioActual.split('.').length > 2;

  if (esSubdominio) {
    redirectToValue = '/dashboard';
  }
  return redirectToValue;
}

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('../modules/profile/profile.module').then((m) => m.ProfileModule),
    data: { layout: 'dark-header' },
  },
  {
    path: 'cartera',
    loadChildren: () =>
      import('../modules/cartera/cartera-routing').then((r) => r.routes),
  },
  {
    path: 'compra',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'contabilidad',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'humano',
    loadChildren: () =>
      import('../modules/humano/humano-routing').then((r) => r.routes),
  },
  {
    path: 'venta',
    loadChildren: () =>
      import('../modules/venta/venta-routing').then((r) => r.routes),
  },
  {
    path: 'inventario',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'tesoreria',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
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
    path: 'administrador',
    children: [
      {
        path: 'lista',
        loadComponent: () =>
          import(
            '../comun/componentes/base-administracion/base-lista/base-lista.component'
          ).then((c) => c.BaseListaComponent),
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import(
            '../comun/componentes/base-administracion/base-nuevo/base-nuevo.component'
          ).then((c) => c.BaseNuevoComponent),
      },
      {
        path: 'editar',
        loadComponent: () =>
          import(
            '../comun/componentes/base-administracion/base-nuevo/base-nuevo.component'
          ).then((c) => c.BaseNuevoComponent),
      },
      {
        path: 'detalle',
        loadComponent: () =>
          import(
            '../comun/componentes/base-administracion/base-detalle/base-detalle.component'
          ).then((c) => c.BaseDetalleComponent),
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
            '../comun/componentes/base-documento/base-lista/base-lista.component'
          ).then((c) => c.BaseListaComponent),
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import(
            '../comun/componentes/base-documento/base-nuevo/base-nuevo.component'
          ).then((c) => c.BaseNuevoComponent),
      },
      {
        path: 'editar',
        loadComponent: () =>
          import(
            '../comun/componentes/base-documento/base-nuevo/base-nuevo.component'
          ).then((c) => c.BaseNuevoComponent),
      },
      {
        path: 'detalle',
        loadComponent: () =>
          import(
            '../comun/componentes/base-documento/base-detalle/base-detalle.component'
          ).then((c) => c.BaseDetalleComponent),
      },
    ],
  },
  {
    path: 'estado',
    loadComponent: () =>
      import('../comun/componentes/facturacion-mensaje-pago/facturacion-mensaje-pago.component').then(
        (c) => c.FacturacionMensajePagoComponent
      ),
    data: { layout: 'dark-header' },
  },
  {
    path: '',
    redirectTo: getRedirectTo(),
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
