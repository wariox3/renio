import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { AnimacionFadeInOutDirective } from '@comun/Directive/AnimacionFadeInOut.directive';
import { PagoService } from '@modulos/humano/servicios/pago.service';
import {
  NgbDropdownModule,
  NgbNavModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { KeeniconComponent } from 'src/app/_metronic/shared/keenicon/keenicon.component';

@Component({
  selector: 'app-pago-detalle',
  standalone: true,
  imports: [
    KeeniconComponent,
    CommonModule,
    FormsModule,
    TranslateModule,
    CardComponent,
    BtnAtrasComponent,
    NgbDropdownModule,
    NgbNavModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    AnimacionFadeInOutDirective,
  ],
  templateUrl: './pago-detalle.component.html',
  styleUrl: './pago-detalle.component.scss',
})
export default class ProgramacionDetalleComponent
  extends General
  implements OnInit
{
  active: Number;
  pago: any = {
    id: null,
    contacto_id: '',
    fecha: '',
    fecha_hasta: '',
    detalles: [],
  };
  arrEstados = {
    estado_aprobado: false,
    estado_anulado: false,
    estado_electronico: false,
    estado_electronico_enviado: false,
    estado_electronico_notificado: false,
  };

  constructor(private pagoService: PagoService) {
    super();
  }

  ngOnInit(): void {
    this.consultarDetalle();
  }

  consultarDetalle() {
    this.pagoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.pago = respuesta.documento;
        this.arrEstados = {
          estado_aprobado: respuesta.documento.estado_aprobado,
          estado_anulado: respuesta.documento.estado_anulado,
          estado_electronico: respuesta.documento.estado_electronico,
          estado_electronico_enviado:
            respuesta.documento.estado_electronico_enviado,
          estado_electronico_notificado:
            respuesta.documento.estado_electronico_notificado,
        };
        this.changeDetectorRef.detectChanges();
      });
  }
}
