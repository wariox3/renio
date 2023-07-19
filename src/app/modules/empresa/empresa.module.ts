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
import { NgbAccordionModule, NgbActiveModal, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { EmpresaEditarComponent } from './componentes/empresa-editar/empresa-editar.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { EmpresaFormularioComponent } from './componentes/empresa-formulario/empresa-formulario.component';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '../../modules/i18n';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CargarImagenComponent } from '@comun/componentes/cargar-imagen/cargar-imagen.component';
import { EmpresaDetalleComponent } from './componentes/empresa-detalle/empresa-detalle.component';

@NgModule({
  declarations: [
    EmpresaComponent,
    EmpresaNuevoComponent,
    EmpresaInvitacionComponent,
    EmpresaEditarComponent,
    EmpresaFormularioComponent,
    EmpresaDetalleComponent,
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
    TranslateModule,
    TranslationModule,
    ImageCropperModule,
    CargarImagenComponent,
    NgbAccordionModule
  ],
  providers:[
    NgbActiveModal
  ]
})
export class EmpresaModule {}
