import { Route } from '@angular/router';
import { EmpresaDetalleComponent } from './componetes/empresa-detalle/empresa-detalle.component';

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
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];
