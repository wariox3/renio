import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, signal, SimpleChanges, ViewChild } from '@angular/core';
import { AlertaService } from '@comun/services/alerta.service';
import { GeneralService } from '@comun/services/general.service';
import { Liquidacion } from '@modulos/humano/interfaces/liquidacion.interface';
import { RespuestaLiquidacionAdicional } from '@modulos/humano/interfaces/respuesta-liquidacion-adicional.interface';
import { ModalLiquidacionAdicionalComponent } from "@modulos/humano/paginas/documento/liquidacion-detalle/componentes/modal-liquidacion-adicional/modal-liquidacion-adicional.component";
import { LiquidacionAdicionalService } from '@modulos/humano/servicios/liquidacion-adicional.service';
import { LiquidacionService } from '@modulos/humano/servicios/liquidacion.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, forkJoin, of, switchMap } from 'rxjs';
import { ParametrosApi } from 'src/app/core/interfaces/api.interface';

@Component({
  selector: 'app-tabla-adicionales',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbTooltipModule,
    ModalLiquidacionAdicionalComponent
  ],
  templateUrl: './tabla-adicionales.component.html',
})
export class TablaAdicionalesComponent implements OnChanges {
  private _generalService = inject(GeneralService);
  private _alertaService = inject(AlertaService);
  private _liquidacionService = inject(LiquidacionService);
  private _liquidacionAdicionalService = inject(LiquidacionAdicionalService);
  public arrLiquidacionAdicional = signal<RespuestaLiquidacionAdicional[]>(
    [],
  );
  isCheckedSeleccionarTodos = signal(false);
  @Input() liquidacion: Liquidacion = {
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
    comentario: null,
  };
  @ViewChild(ModalLiquidacionAdicionalComponent)
  ModalLiquidacionAdicionalComponent: ModalLiquidacionAdicionalComponent;
  arrParametrosConsulta = signal<ParametrosApi>({});
  registrosAEliminar = signal<number[]>([]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['liquidacion'] && !changes['liquidacion'].firstChange) {
      this.consultarDatos();
    }
  }

  toggleSelectAll(event: Event) {
    const seleccionarTodos = event.target as HTMLInputElement;
    this.isCheckedSeleccionarTodos.update((checked) => (checked = !checked));
    let registros = this.arrLiquidacionAdicional();

    if (seleccionarTodos.checked) {
      registros.map((item: any) => {
        item.selected = true;
        const index = this.registrosAEliminar().indexOf(item.id);
        if (index === -1) {
          let registros = this.registrosAEliminar();
          this.registrosAEliminar.set([...registros, item.id]);
        }
      });

      this.arrLiquidacionAdicional.set(registros);
    } else {
      registros.map((item: any) => {
        item.selected = false;
      });
      this.arrLiquidacionAdicional.set(registros);
      this.registrosAEliminar.set([]);
    }
  }


  eliminarRegistros() {
    const eliminaciones$ = this.registrosAEliminar().map(liquidacionId =>
      this._liquidacionAdicionalService.eliminar(liquidacionId).pipe(
        catchError(err => {
          console.error(`Error al eliminar liquidacion adicional  ${liquidacionId}:`, err);
          return of(null); // devolvemos algo para que forkJoin no falle
        })
      )
    );

    forkJoin(eliminaciones$)
      .pipe(
        switchMap(() =>
          this._liquidacionService.getLiquidacionPorId(this.liquidacion.id)
        )
      )
      .subscribe({
        next: () => {
          // Después de eliminar, volver a la primera página y recargar
          this.isCheckedSeleccionarTodos.set(false);
          this._alertaService.mensajaExitoso('Registro eliminado');
          this.registrosAEliminar.set([]);
        },
        error: err => {
          console.error('Error al eliminar conductor:', err);
        },
      });
    this.consultarDatos();
  }

  consultarDatos() {
    this.inicializarParametrosConsultaAdicional();
    this._generalService.consultaApi<any>('humano/liquidacion_adicional/', this.arrParametrosConsulta()).subscribe(respuesta => {
      this.arrLiquidacionAdicional.set(
        respuesta.results.map((registro: any) => ({
          ...registro,
          selected: false,
        })),

      );
    })
  }

  inicializarParametrosConsultaAdicional() {
    this.arrParametrosConsulta.set({
      liquidacion_id: this.liquidacion!.id,
      limit: 1000,
    });
  }

  abrirModalNuevoAdicional() {
    this.ModalLiquidacionAdicionalComponent.abrirModalNuevo('1');
  }

  abrirModalNuevoDeduccion() {
    this.ModalLiquidacionAdicionalComponent.abrirModalNuevo('-1');
  }

  agregarRegistrosEliminar(id: number) {
    let registros = this.registrosAEliminar();
    let index = registros.indexOf(id);
    let adicionales = this.arrLiquidacionAdicional();

    adicionales.find((contrato: RespuestaLiquidacionAdicional) => {
      if (contrato.id === id) {
        contrato.selected = !contrato.selected;
      }
    });
    this.arrLiquidacionAdicional.set(adicionales);
    if (index !== -1) {
      const updatedRegistros = [...registros];
      updatedRegistros.splice(index, 1);
      this.registrosAEliminar.set(updatedRegistros);
    } else {
      this.registrosAEliminar.set([...registros, id]);
    }
  }
}
