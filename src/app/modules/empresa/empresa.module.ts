import { NgModule } from '@angular/core';
import { EmpresaRoutingModule } from './empresa-routing.module';
import { EmpresaDetalleComponent } from './componetes/empresa-detalle/empresa-detalle.component';
import { EmpresaEditarComponent } from './componetes/empresa-editar/empresa-editar.component';

@NgModule({
  imports: [
    EmpresaRoutingModule,
    EmpresaDetalleComponent,
    EmpresaEditarComponent,
  ],
})
export class EmpresaModule {}
