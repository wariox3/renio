import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BaseEstadosComponent } from '@comun/componentes/base-estados/base-estados.component';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { AnimacionFadeInOutDirective } from '@comun/directive/animacion-fade-in-out.directive';
import { HttpService } from '@comun/services/http.service';
import { PagoService } from '@modulos/humano/servicios/pago.service';
import {
  NgbDropdownModule,
  NgbNavModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { KeeniconComponent } from 'src/app/_metronic/shared/keenicon/keenicon.component';
import { TituloAccionComponent } from "../../../../../../comun/componentes/titulo-accion/titulo-accion.component";
import { DocumentoOpcionesComponent } from "../../../../../../comun/componentes/documento-opciones/documento-opciones.component";

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
    BaseEstadosComponent,
    TituloAccionComponent,
    DocumentoOpcionesComponent
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

  constructor(private pagoService: PagoService, private httpService: HttpService) {
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
        this.changeDetectorRef.detectChanges();
      });
  }

  imprimir() {
    this.httpService.descargarArchivo('general/documento/imprimir/', {
      filtros: [],
      limite: 50,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: '',
      tipo: '',
      documento_tipo_id: 14,
      documento_id: this.detalle,
    });
  }

}
