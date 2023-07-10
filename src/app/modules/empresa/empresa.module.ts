import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresaComponent } from './componentes/empresa-lista/empresa.component';
import { EmpresaNuevoComponent } from './componentes/empresa-nuevo/empresa-nuevo.component';
import { EmpresaInvitacionComponent } from './componentes/empresa-invitacion/empresa-invitacion.component';

import { EmpresaRoutingModule } from './empresa-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ExtrasModule } from '../../_metronic/partials/layout/extras/extras.module';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from '../../_metronic/shared/shared.module';
import { NgbActiveModal, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { EmpresaEditarComponent } from './componentes/empresa-editar/empresa-editar.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { EmpresaFormularioComponent } from './componentes/empresa-formulario/empresa-formulario.component';

@NgModule({
  declarations: [
    EmpresaComponent,
    EmpresaNuevoComponent,
    EmpresaInvitacionComponent,
    EmpresaEditarComponent,
    EmpresaFormularioComponent,
  ],
  imports: [
    CommonModule,
    EmpresaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ExtrasModule,
    MatMenuModule,
    SharedModule,
    NgbDropdownModule,
    NgbModalModule,
  ],
  providers:[
    NgbActiveModal
  ]
})
export class EmpresaModule {}
