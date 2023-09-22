import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InquilinoListaComponent } from './componentes/inquilino-lista/inquilino-lista.component';
import { InquilinoNuevoComponent } from './componentes/inquilino-nuevo/inquilino-nuevo.component';
import { InquilinoInvitacionComponent } from './componentes/inquilino-invitacion/inquilino-invitacion.component';
import { InquilinoEditarComponent } from './componentes/inquilino-editar/inquilino-editar.component';
import { InquilinoFormularioComponent } from './componentes/inquilino-formulario/inquilino-formulario.component';
import { EmpresaRoutingModule } from './inquilino-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ExtrasModule } from '../../_metronic/partials/layout/extras/extras.module';
import { SharedModule } from '../../_metronic/shared/shared.module';
import {
  NgbAccordionModule,
  NgbActiveModal,
  NgbDropdownModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '../i18n';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CargarImagenComponent } from '@comun/componentes/cargar-imagen/cargar-imagen.component';
import { InquilinoDetalleComponent } from './componentes/inquilino-detalle/inquilino-detalle.component';
import { InquilinoFacturacionComponent } from './componentes/inquilino-facturacion/inquilino-facturacion.component';
import { NgOptimizedImage } from '@angular/common';
import { ContadorComponent } from '@comun/componentes/contador/contador.component';

@NgModule({
  declarations: [
    InquilinoListaComponent,
    InquilinoNuevoComponent,
    InquilinoInvitacionComponent,
    InquilinoEditarComponent,
    InquilinoFormularioComponent,
    InquilinoDetalleComponent,
    InquilinoFacturacionComponent,
  ],
  imports: [
    CommonModule,
    EmpresaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ExtrasModule,
    SharedModule,
    NgbDropdownModule,
    NgbModalModule,
    TranslateModule,
    TranslationModule,
    ImageCropperModule,
    CargarImagenComponent,
    NgbAccordionModule,
    NgOptimizedImage,
    ContadorComponent,
  ],
  providers: [NgbActiveModal],
})
export class InquilinoModule {}
