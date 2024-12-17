import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { HttpService } from '@comun/services/http.service';
import { CreditoService } from '@modulos/humano/servicios/credito.service';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { TituloAccionComponent } from "../../../../../../comun/componentes/titulo-accion/titulo-accion.component";

@Component({
  selector: 'app-credito-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    CardComponent,
    BtnAtrasComponent,
    NgbNavModule,
    TituloAccionComponent
],
  templateUrl: './credito-detalle.component.html',
  styleUrl: './credito-detalle.component.scss',
})
export default class CreditoDetalleComponent extends General {
  credito: any = {
      "id": 0,
      "fecha_inicio": "",
      "total": 0,
      "cuota": 0,
      "abono": 0,
      "saldo": 0,
      "cantidad_cuotas": 0,
      "validar_cuotas": false,
      "pagado": false,
      "inactivo": false,
      "inactivo_periodo": false,
      "contrato": 0
  };

  arrCreditoPagos: any;
  active: Number;

  constructor(
    private creditoService: CreditoService,
    private httpService: HttpService
  ) {
    super();
    this.consultardetalle();
  }

  consultardetalle() {
    this.creditoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.credito = respuesta;
        this.consultarCreditoPagos();
        this.changeDetectorRef.detectChanges();
      });
  }

  consultarCreditoPagos() {
    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista/',
        {
          filtros: [
            {
              operador: '',
              propiedad: 'credito_id',
              valor1: this.credito.id,
              valor2: '',
            },
          ],
          limite: 10,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'GenDocumentoDetalle',
        }
      ).subscribe((respuesta: any) => {
        this.arrCreditoPagos = respuesta.registros
        this.changeDetectorRef.detectChanges();
      });
  }
}
