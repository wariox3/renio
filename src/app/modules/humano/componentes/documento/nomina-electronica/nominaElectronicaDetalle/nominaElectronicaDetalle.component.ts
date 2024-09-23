import { HttpService } from '@comun/services/http.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { Documento } from '@interfaces/humano/nominaElectronica.';
import { NominaElectronicaService } from '@modulos/humano/servicios/nomina-electronica.service';
import { TranslateModule } from '@ngx-translate/core';
import { switchMap, tap, zip } from 'rxjs';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-nomina-electronica-detalle',
  standalone: true,
  imports: [
    CommonModule,
    BtnAtrasComponent,
    CardComponent,
    TranslateModule,
    NgbNavModule,
  ],
  templateUrl: './nominaElectronicaDetalle.component.html',
  styleUrl: './nominaElectronicaDetalle.component.scss',
})
export default class NominaElectronicaDetalleComponent
  extends General
  implements OnInit
{
  active: Number;

  nominaElectronica: Documento = {
    id: 0,
    numero: undefined,
    fecha: '',
    fecha_vence: undefined,
    fecha_hasta: undefined,
    contacto_id: 0,
    contacto_numero_identificacion: '',
    contacto_nombre_corto: '',
    descuento: 0,
    base_impuesto: 0,
    subtotal: 0,
    afectado: 0,
    pendiente: 0,
    impuesto: 0,
    total: 0,
    devengado: 0,
    deduccion: 0,
    base_cotizacion: 0,
    base_prestacion: 0,
    salario: 0,
    estado_aprobado: false,
    documento_tipo_id: 0,
    metodo_pago_id: undefined,
    metodo_pago_nombre: '',
    estado_anulado: false,
    comentario: undefined,
    estado_electronico: false,
    estado_electronico_enviado: false,
    estado_electronico_notificado: false,
    soporte: undefined,
    orden_compra: undefined,
    plazo_pago_id: undefined,
    plazo_pago_nombre: '',
    documento_referencia_id: undefined,
    documento_referencia_numero: '',
    cue: undefined,
    electronico_id: undefined,
    asesor: undefined,
    asesor_nombre_corto: undefined,
    sede: undefined,
    sede_nombre: undefined,
    programacion_detalle_id: undefined,
    contrato_id: undefined,
    detalles: [],
    pagos: [],
  };
  arrNominas: any[] = []

  constructor(
    private nominaElectronicaService: NominaElectronicaService,
    private httpService: HttpService
  ) {
    super();
  }

  ngOnInit(): void {
    this.consultarDetalle();
  }

  consultarDetalle() {
    zip(
      this.nominaElectronicaService.consultarDetalle(this.detalle),
      this.httpService.post<{ cantidad_registros: number; registros: any[] }>('general/funcionalidad/lista/', {
        filtros: [
          { propiedad: 'documento_referencia_id', valor1: this.detalle },
        ],
        modelo: 'GenDocumento',
      })
    ).subscribe((respuesta) => {
      this.nominaElectronica = respuesta[0].documento;
      this.arrNominas = respuesta[1].registros;

      this.changeDetectorRef.detectChanges();
    });
  }

  emitir() {
    this.httpService
      .post('general/documento/emitir/', { documento_id: this.detalle })
      .subscribe((respuesta: any) => {
        this.alertaService.mensajaExitoso('Documento aprobado');
        this.consultarDetalle();
      });
  }

  aprobar() {
    this.httpService
      .post('general/documento/aprobar/', { id: this.detalle })
      .pipe(
        switchMap(() =>
          this.nominaElectronicaService.consultarDetalle(this.detalle)
        ),
        tap((respuestaConsultaDetalle) => {
          this.nominaElectronica = respuestaConsultaDetalle.documento;
          this.changeDetectorRef.detectChanges();
          this.alertaService.mensajaExitoso('Documento aprobado');
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }
}
