import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    redirectTo: 'lista',
    pathMatch: 'full',
  },
  {
    path: 'lista',
    loadComponent: () =>
      import('./paginas/empresa-detalle/empresa-detalle.component').then(
        (c) => c.EmpresaDetalleComponent
      ),
  },
  {
    path: 'detalle/:empresacodigo',
    loadComponent: () =>
      import('./paginas/empresa-detalle/empresa-detalle.component').then(
        (c) => c.EmpresaDetalleComponent
      ),
    children: [
      {
        path: '', // Ruta vacía, se inicia por defecto cuando se carga la ruta padre
        redirectTo: 'configuracion',
        pathMatch: 'full',
      },
      {
        path: 'general',
        loadComponent: () =>
          import('./paginas/empresa-editar/empresa-editar.component').then(
            (c) => c.EmpresaEditarComponent
          ),
      },
      {
        path: 'facturacionelectronica',
        loadComponent: () =>
          import(
            './paginas/empresa-facturacion-electronica/empresa-facturacion-electronica.component'
          ).then((c) => c.EmpresaFacturacionElectronicaComponent),
      },
      {
        path: 'configuracion',
        loadComponent: () =>
          import(
            './paginas/empresa-configuracion/empresa-configuracion.component'
          ).then((c) => c.EmpresaConfiguracionComponent),
      },
    ],
  },
  {
    path: 'configuracion_modulos/:empresacodigo',
    loadComponent: () =>
      import('./paginas/emprese-configuracion-modulos/emprese-configuracion-modulos.component').then(
        (c) => c.EmpreseConfiguracionModulosComponent
      ),
  },
  {
    path: 'configuracion_inicial',
    loadComponent: () =>
      import('./paginas/empresa-pasoapaso/empresa-pasoapaso.component').then(
        (c) => c.EmpresaPasoapasoComponent
      ),
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];
