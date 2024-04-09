import { NgModule } from '@angular/core';
import { ContenedorListaComponent } from './componentes/contenedor-lista/contenedor-lista.component';
import { ContenedorNuevoComponent } from './componentes/contenedor-nuevo/contenedor-nuevo.component';
import { ContenedorInvitacionComponent } from './componentes/contenedor-invitacion/contenedor-invitacion.component';
import { ContenedorEditarComponent } from './componentes/contenedor-editar/contenedor-editar.component';
import { ContenedorDetalleComponent } from './componentes/contenedor-detalle/contenedor-detalle.component';
import { ContenedorFacturacionComponent } from './componentes/contenedor-facturacion/contenedor-facturacion.component';
import { EmpresaRoutingModule } from './contenedor-routing.module';


@NgModule({
  imports: [
    ContenedorListaComponent,
    ContenedorNuevoComponent,
    ContenedorInvitacionComponent,
    ContenedorDetalleComponent,
    ContenedorEditarComponent,
    ContenedorFacturacionComponent,
    EmpresaRoutingModule,
  ],
})
export class ContenedorModule {}
