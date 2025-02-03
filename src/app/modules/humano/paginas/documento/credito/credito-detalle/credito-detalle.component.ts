import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { GeneralService } from '@comun/services/general.service';
import { CreditoService } from '@modulos/humano/servicios/credito.service';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { Credito } from '@modulos/humano/interfaces/credito.interface';
import { SiNoPipe } from '@pipe/si-no.pipe';

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
    TituloAccionComponent,
    SiNoPipe
  ],
  templateUrl: './credito-detalle.component.html',
  styleUrl: './credito-detalle.component.scss',
})
export default class CreditoDetalleComponent extends General {
  credito: Credito = {
    id: 0,
    fecha_inicio: '',
    total: 0,
    cuota: 0,
    abono: 0,
    saldo: 0,
    cantidad_cuotas: 0,
    validar_cuotas: false,
    pagado: false,
    inactivo: false,
    inactivo_periodo: false,
    cuota_actual: 0,
    contrato_id: 0,
    contrato_contacto_id: 0,
    contrato_contacto_numero_identificacion: '',
    contrato_contacto_nombre_corto: '',
    concepto_id: 0,
    concepto_nombre: '',
    aplica_prima: false,
    aplica_cesantia: false
  };

  arrCreditoPagos: any;
  active: Number;

  private readonly _generalService = inject(GeneralService);

  constructor(
    private creditoService: CreditoService,
  ) {
    super();
    this.consultardetalle();
  }

  consultardetalle() {
    this.creditoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta) => {
        this.credito = respuesta;
        this.consultarCreditoPagos();
        this.changeDetectorRef.detectChanges();
      });
  }

  consultarCreditoPagos() {
    this._generalService
      .consultarDatosAutoCompletar<any>({
        filtros: [
          {
            propiedad: 'credito_id',
            valor1: this.credito.id,
          },
        ],
        limite: 10,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: 'GenDocumentoDetalle',
      })
      .subscribe((respuesta: any) => {
        this.arrCreditoPagos = respuesta.registros;
        this.changeDetectorRef.detectChanges();
      });
  }
}
