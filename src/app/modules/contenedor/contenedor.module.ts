import { provideNgxMask, NgxMaskPipe, NgxMaskDirective } from 'ngx-mask';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContenedorListaComponent } from './componentes/contenedor-lista/contenedor-lista.component';
import { ContenedorNuevoComponent } from './componentes/contenedor-nuevo/contenedor-nuevo.component';
import { ContenedorInvitacionComponent } from './componentes/contenedor-invitacion/contenedor-invitacion.component';
import { ContenedorEditarComponent } from './componentes/contenedor-editar/contenedor-editar.component';
import { ContenedorFormularioComponent } from './componentes/contenedor-formulario/contenedor-formulario.component';
import { ContenedorDetalleComponent } from './componentes/contenedor-detalle/contenedor-detalle.component';
import { ContenedorFacturacionComponent } from './componentes/contenedor-facturacion/contenedor-facturacion.component';
import { EmpresaRoutingModule } from './contenedor-routing.module';
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
import { ContadorComponent } from '@comun/componentes/contador/contador.component';
import { AnimationFadeinUpDirective } from '@comun/Directive/AnimationFadeinUp.directive';
import { NgOptimizedImage } from '@angular/common';

@NgModule({
  declarations: [
    ContenedorListaComponent,
    ContenedorNuevoComponent,
    ContenedorInvitacionComponent,
    ContenedorEditarComponent,
    ContenedorFormularioComponent,
    ContenedorDetalleComponent,
    ContenedorFacturacionComponent,
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
    ContadorComponent,
    NgxMaskDirective,
    NgxMaskPipe,
    AnimationFadeinUpDirective,
    NgOptimizedImage
  ],
  providers: [NgbActiveModal, provideNgxMask()],
})
export class ContenedorModule {}
