import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpresaRoutingModule } from './empresa-routing.module';
import { EmpresaDetalleComponent } from './componetes/empresa-detalle/empresa-detalle.component';
import { CargarImagenComponent } from '../../comun/componentes/cargar-imagen/cargar-imagen.component';
import { CardComponent } from '../../comun/componentes/card/card.component';
import { EmpresaEditarComponent } from './componetes/empresa-editar/empresa-editar.component';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from "../../_metronic/shared/shared.module";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@NgModule({
    declarations: [EmpresaDetalleComponent, EmpresaEditarComponent],
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
    ],
    providers: [NgbActiveModal, provideNgxMask()],

})
export class EmpresaModule {}
