import { HttpService } from '@comun/services/http.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { NominaElectronicaService } from '@modulos/humano/servicios/nomina-electronica.service';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY, switchMap, tap, zip } from 'rxjs';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { BaseEstadosComponent } from '../../../../../../comun/componentes/base-estados/base-estados.component';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { GeneralService } from '@comun/services/general.service';
import { DocumentoOpcionesComponent } from '../../../../../../comun/componentes/documento-opciones/documento-opciones.component';
import { RespuestaApi } from 'src/app/core/interfaces/api.interface';
import {
  NominaElectronica,
  NominaElectronicaDetalle,
  NominaElectronicaDetalleNomina,
} from '@modulos/humano/interfaces/nomina-electronica.interface';

@Component({
  selector: 'app-nomina-electronica-detalle',
  standalone: true,
  imports: [
    CommonModule,
    BtnAtrasComponent,
    CardComponent,
    TranslateModule,
    NgbNavModule,
    BaseEstadosComponent,
    TituloAccionComponent,
    DocumentoOpcionesComponent,
  ],
  templateUrl: './nominaElectronicaDetalle.component.html',
  styleUrl: './nominaElectronicaDetalle.component.scss',
})
export default class NominaElectronicaDetalleComponent
  extends General
  implements OnInit
{
  active: Number;

  nominaElectronica: NominaElectronicaDetalleNomina = {
    id: 0,
    documento_tipo__nombre: '',
    numero: 0,
    fecha: '',
    soporte: null,
    contacto_id: 0,
    contacto__numero_identificacion: '',
    contacto__nombre_corto: '',
    devengado: 0,
    deduccion: 0,
    base_cotizacion: 0,
    base_prestacion: 0,
    subtotal: 0,
    impuesto: 0,
    total: 0,
    cue: null,
    estado_aprobado: false,
    estado_anulado: false,
    estado_electronico: false,
    estado_electronico_evento: false,
    estado_contabilizado: false,
    estado_electronico_enviado: false,
  };

  arrNominas: NominaElectronicaDetalle[] = [];
  private _generalService = inject(GeneralService);

  constructor(
    private nominaElectronicaService: NominaElectronicaService,
    private httpService: HttpService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.consultarDetalle();
  }

  consultarDetalle() {
    zip(
      this._generalService.consultaApi<NominaElectronicaDetalleNomina>(
        `general/documento/${this.detalle}/`,
        {
          serializador: 'detalle_nomina',
        },
      ),
      this._generalService.consultaApi<RespuestaApi<NominaElectronicaDetalle>>(
        'general/documento/',
        {
          documento_referencia_id: this.detalle,
          serializador: 'lista_nomina',
        },
      ),
    ).subscribe((respuesta) => {
      this.nominaElectronica = respuesta[0];
      this.arrNominas = respuesta[1].results;
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
    this.alertaService
      .confirmarSinReversa()
      .pipe(
        switchMap((respuesta) => {
          if (respuesta.isConfirmed) {
            return this.httpService.post('general/documento/aprobar/', {
              id: this.detalle,
            });
          }
          return EMPTY;
        }),
        switchMap((respuesta) =>
          respuesta
            ? this.nominaElectronicaService.consultarDetalle(this.detalle)
            : EMPTY,
        ),
        tap((respuestaConsultaDetalle: any) => {
          this.nominaElectronica = respuestaConsultaDetalle.documento;
          if (respuestaConsultaDetalle) {
            this.alertaService.mensajaExitoso(
              this.translateService.instant('MENSAJES.DOCUMENTOAPROBADO'),
            );
            this.changeDetectorRef.detectChanges();
          }
        }),
      )
      .subscribe();
  }
}
