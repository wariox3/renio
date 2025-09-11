import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { General } from '@comun/clases/general';
import { BaseEstadosComponent } from '@comun/componentes/base-estados/base-estados.component';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { TituloAccionComponent } from '@comun/componentes/titulo-accion/titulo-accion.component';
import { HttpService } from '@comun/services/http.service';
import { Liquidacion } from '@modulos/humano/interfaces/liquidacion.interface';
import { LiquidacionService } from '@modulos/humano/servicios/liquidacion.service';
import {
  NgbDropdownModule,
  NgbNavModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { CardComponent } from '../../../../../comun/componentes/card/card.component';
import { TablaAdicionalesComponent } from "./componentes/tabla-adicionales/tabla-adicionales.component";

@Component({
  selector: 'app-nomina-electronica-detalle',
  standalone: true,
  imports: [
    CardComponent,
    CommonModule,
    TranslateModule,
    BtnAtrasComponent,
    NgbDropdownModule,
    NgbNavModule,
    NgbTooltipModule,
    BaseEstadosComponent,
    TituloAccionComponent,
    TablaAdicionalesComponent
  ],
  templateUrl: './liquidacion-detalle.component.html',
  styleUrl: './liquidacion-detalle.component.scss',
})
export default class LiquidacionDetalleComponent
  extends General
  implements OnInit {
  private liquidacionService = inject(LiquidacionService);

  active: Number = 1;
  liquidacion = signal<Liquidacion>({
    id: 0,
    fecha: '',
    contrato__contacto__numero_identificacion: '',
    contrato__contacto__nombre_corto: '',
    contrato__salario: 0,
    contrato_id: 0,
    fecha_desde: '',
    fecha_hasta: '',
    total: 0,
    dias: 0,
    dias_cesantia: 0,
    dias_prima: 0,
    dias_vacacion: 0,
    fecha_ultimo_pago: null,
    fecha_ultimo_pago_prima: null,
    fecha_ultimo_pago_cesantia: null,
    fecha_ultimo_pago_vacacion: null,
    cesantia: 0,
    interes: 0,
    prima: 0,
    vacacion: 0,
    deduccion: 0,
    adicion: 0,
    estado_generado: false,
    estado_aprobado: false,
    comentario: undefined
  });
  generando = signal<boolean>(false);
  desgenerando = signal<boolean>(false);
  reliquiando = signal<boolean>(false);
  notificando = signal<boolean>(false);
  @ViewChild(TablaAdicionalesComponent)
  tablaAdicionalesComponent: TablaAdicionalesComponent;

  constructor(private httpService: HttpService) {
    super();
  }

  ngOnInit(): void {
    this.consultarDetalle();
  }

  consultarDetalle() {
    this.liquidacionService
      .getLiquidacionPorId(this.detalle)
      .subscribe((respuesta) => {
        this.liquidacion.set(respuesta);
      });
  }

  imprimir() {
    this.httpService.descargarArchivo('humano/liquidacion/imprimir/', {
      filtros: [],
      limite: 50,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: '',
      tipo: '',
      id: this.detalle,
    });
  }

  generar() {
    this.liquidacionService.generar(this.detalle).subscribe({
      next: () => {
        this.consultarDetalle();
        this.alertaService.mensajaExitoso('Documento generado con exito!');
      },
    });
  }

  aprobar() {
    this.liquidacionService.aprobar(this.detalle).subscribe({
      next: () => {
        this.consultarDetalle();
        this.alertaService.mensajaExitoso('Documento aprobado con exito!');
      },
    });
  }

  desgenerar() {
    this.desgenerando.set(true);
    this.liquidacionService
      .desgenerar(this.detalle)
      .pipe(
        finalize(() => {
          this.desgenerando.set(false);
          this.consultarDetalle();
        }),
      )
      .subscribe();
  }

  reliquiar() {
    this.reliquiando.set(true);
    this.liquidacionService
      .reliquiar(this.detalle)
      .pipe(
        finalize(() => {
          this.reliquiando.set(false);
          this.consultarDetalle();
        }),
      )
      .subscribe(() => {
        this.alertaService.mensajaExitoso('Documento reliquidado con exito!');
      });
  }

  confirmarDesaprobarDocumento() {
    this.alertaService
      .confirmar({
        titulo: '¿Estas seguro de desaprobar?',
        texto: '',
        textoBotonCofirmacion: 'Si, desaprobar',
      })
      .then((respuesta) => {
        if (respuesta.isConfirmed) {
          this._desaprobarDocumento(this.detalle);
        }
      });
  }

  private _desaprobarDocumento(documentoId: number) {
    this.liquidacionService.desaprobar(documentoId).subscribe({
      next: () => {
        this.alertaService.mensajaExitoso('Documento desaprobado con exito!');
        this.consultarDetalle();
      },
    });
  }

  private _consultarAdicionalesTab() {
    this.tablaAdicionalesComponent.consultarDatos();
  }
}
