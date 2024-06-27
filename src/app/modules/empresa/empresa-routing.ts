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
      import('./componetes/empresa-detalle/empresa-detalle.component').then(
        (c) => c.EmpresaDetalleComponent
      ),
  },
  {
    path: 'detalle/:empresacodigo',
    loadComponent: () =>
      import('./componetes/empresa-detalle/empresa-detalle.component').then(
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
          import('./componetes/empresa-editar/empresa-editar.component').then(
            (c) => c.EmpresaEditarComponent
          ),
      },
      {
        path: 'facturacionelectronica',
        loadComponent: () =>
          import(
            './componetes/empresa-facturacion-electronica/empresa-facturacion-electronica.component'
          ).then((c) => c.EmpresaFacturacionElectronicaComponent),
      },
      {
        path: 'configuracion',
        loadComponent: () =>
          import(
            './componetes/empresa-configuracion/empresa-configuracion.component'
          ).then((c) => c.EmpresaConfiguracionComponent),
      },
      {
        path: 'documento_tipo',
        loadComponent: () =>
          import(
            './componetes/documento-tipo/empresa-documento-tipo-lista/empresa-documento-tipo.component'
          ).then((c) => c.DocumentoDocumentoTipoComponent),
      },
    ],
  },
  {
    path: 'configuracion_inicial',
    loadComponent: () =>
      import('./componetes/empresa-pasoapaso/empresa-pasoapaso.component').then(
        (c) => c.EmpresaPasoapasoComponent
      ),
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];
