import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresaRoutingModule } from './empresa-routing.module';
import { EmpresaDetalleComponent } from './componetes/empresa-detalle/empresa-detalle.component';
import { EmpresaEditarComponent } from './componetes/empresa-editar/empresa-editar.component';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbActiveModal,
  NgbDropdownModule,
  NgbModalModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import ResolucionFormularioComponent from '@modulos/general/componentes/resolucion/resolucion-formulario/resolucion-formulario.component';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { CardComponent } from '@comun/componentes/card/card.component';
import { CargarImagenComponent } from '@comun/componentes/cargar-imagen/cargar-imagen.component';

@NgModule({
  imports: [
    CommonModule,
    EmpresaRoutingModule,
    CargarImagenComponent,
    CardComponent,
    TranslateModule,
    TranslationModule,
    ImageCropperModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    NgbDropdownModule,
    SharedModule,
    NgxMaskDirective,
    NgxMaskPipe,
    ResolucionFormularioComponent,
    EmpresaDetalleComponent,
    EmpresaEditarComponent,
  ],
  providers: [NgbActiveModal, provideNgxMask()],
})
export class EmpresaModule {}
