import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
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
  ],
  templateUrl: './liquidacion-detalle.component.html',
  styleUrl: './liquidacion-detalle.component.scss',
})
export default class LiquidacionDetalleComponent
  extends General
  implements OnInit
{
  private liquidacionService = inject(LiquidacionService);

  active: Number;
  liquidacion = signal<Liquidacion | null>(null);
  generando = signal<boolean>(false);
  desgenerando = signal<boolean>(false);
  notificando = signal<boolean>(false);

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
    this.httpService.descargarArchivo('general/documento/imprimir/', {
      filtros: [],
      limite: 50,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: '',
      tipo: '',
      documento_tipo_id: 22,
      documento_id: this.detalle,
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

  notificar() {
    this.notificando.set(true);
    this.liquidacionService
      .notificar(this.detalle)
      .pipe(
        finalize(() => {
          this.notificando.set(false);
          this.consultarDetalle();
        }),
      )
      .subscribe();
  }
}
