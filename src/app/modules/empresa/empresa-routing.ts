import { Route } from '@angular/router';
import { EmpresaDetalleComponent } from './componetes/empresa-detalle/empresa-detalle.component';
import { EmpresaEditarComponent } from './componetes/empresa-editar/empresa-editar.component';
import { EmpresaConfiguracionComponent } from './componetes/empresa-configuracion/empresa-configuracion.component';
import { EmpresaFacturacionElectronicaComponent } from './componetes/empresa-facturacion-electronica/empresa-facturacion-electronica.component';

export const routes: Route[] = [
  {
    path: '',
    redirectTo: 'lista',
    pathMatch: 'full',
  },
  {
    path: 'lista',
    component: EmpresaDetalleComponent,
  },
  {
    path: 'detalle/:empresacodigo',
    component: EmpresaDetalleComponent,
    children: [
      {
        path: '', // Ruta vacía, se inicia por defecto cuando se carga la ruta padre
        redirectTo: 'general',
        pathMatch: 'full',
      },
      {
        path: 'general',
        component: EmpresaEditarComponent,
      },
      {
        path: 'facturacionelectronica',
        component: EmpresaFacturacionElectronicaComponent,
      },
      {
        path: 'configuracion',
        component: EmpresaConfiguracionComponent,
      },
    ],
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];
