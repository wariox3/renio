import { Routes } from '@angular/router';
import { validarRutaGuard } from '@guardias/validar-ruta.guard';

let redirectToValue: string = '/inicio';

// function getRedirectTo(): string {
//   // Aquí puedes agregar tu lógica para determinar el valor de redirección
//   // basado en la variable o cualquier otra condición
//   let dominioActual = window.location.host;
//   let esSubdominio = dominioActual.split('.').length > 2;

//   if (esSubdominio) {
//     redirectToValue = '/dashboard';
//   }
//   return redirectToValue;
// }

const Routing: Routes = [
  {
    path: 'general',
    canActivate: [validarRutaGuard],
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
    canActivateChild: [validarRutaGuard],
    loadChildren: () =>
      import('../modules/cartera/cartera-routing').then((r) => r.routes),
  },
  {
    path: 'compra',
    canActivateChild: [validarRutaGuard],
    loadChildren: () =>
      import('../modules/compra/compra-routing').then((r) => r.routes),
  },
  {
    path: 'contabilidad',
    canActivateChild: [validarRutaGuard],
    loadChildren: () =>
      import('../modules/contabilidad/contabilidad-routing').then(
        (r) => r.routes,
      ),
  },
  {
    path: 'humano',
    canActivateChild: [validarRutaGuard],
    loadChildren: () =>
      import('../modules/humano/humano-routing').then((r) => r.routes),
  },
  {
    path: 'venta',
    canActivateChild: [validarRutaGuard],
    loadChildren: () =>
      import('../modules/venta/venta-routing').then((r) => r.routes),
  },
  {
    path: 'inventario',
    canActivateChild: [validarRutaGuard],
    loadChildren: () =>
      import('../modules/inventario/inventario.routes').then((m) => m.routes),
  },
  {
    path: 'tesoreria',
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
  // {
  //   path: 'administrador',
  //   canActivateChild: [validarRutaGuard],
  //   children: [
  //     {
  //       path: 'lista',
  //       loadComponent: () =>
  //         import(
  //           '../comun/componentes/base-administracion/base-lista/base-lista.component'
  //         ).then((c) => c.BaseListaComponent),
  //     },
  //     {
  //       path: 'nuevo',
  //       loadComponent: () =>
  //         import(
  //           '../comun/componentes/base-administracion/base-nuevo/base-nuevo.component'
  //         ).then((c) => c.BaseNuevoComponent),
  //     },
  //     {
  //       path: 'editar',
  //       loadComponent: () =>
  //         import(
  //           '../comun/componentes/base-administracion/base-nuevo/base-nuevo.component'
  //         ).then((c) => c.BaseNuevoComponent),
  //     },
  //     {
  //       path: 'detalle',
  //       loadComponent: () =>
  //         import(
  //           '../comun/componentes/base-administracion/base-detalle/base-detalle.component'
  //         ).then((c) => c.BaseDetalleComponent),
  //     },
  //   ],
  // },
  // {
  //   path: 'documento',
  //   canActivateChild: [validarRutaGuard],
  //   children: [
  //     {
  //       path: 'lista',
  //       loadComponent: () =>
  //         import(
  //           '../comun/componentes/base-documento/base-lista/base-lista.component'
  //         ).then((c) => c.BaseListaComponent),
  //     },
  //     {
  //       path: 'nuevo',
  //       loadComponent: () =>
  //         import(
  //           '../comun/componentes/base-documento/base-nuevo/base-nuevo.component'
  //         ).then((c) => c.BaseNuevoComponent),
  //     },
  //     {
  //       path: 'editar',
  //       loadComponent: () =>
  //         import(
  //           '../comun/componentes/base-documento/base-nuevo/base-nuevo.component'
  //         ).then((c) => c.BaseNuevoComponent),
  //     },
  //     {
  //       path: 'detalle',
  //       loadComponent: () =>
  //         import(
  //           '../comun/componentes/base-documento/base-detalle/base-detalle.component'
  //         ).then((c) => c.BaseDetalleComponent),
  //     },
  //   ],
  // },
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
  // {
  //   path: '',
  //   redirectTo: getRedirectTo(),
  //   pathMatch: 'full',
  // },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
