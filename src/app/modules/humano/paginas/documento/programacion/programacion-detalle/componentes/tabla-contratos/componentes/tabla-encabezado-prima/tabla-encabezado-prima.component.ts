import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { General } from '@comun/clases/general';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { ProgramacionRespuesta } from '@modulos/humano/interfaces/programacion.interface';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ModalProgramacionDetalleEditarContratoComponent } from '../../../modal-programacion-detalle-editar-contrato/modal-programacion-detalle-editar-contrato.component';
import { ModalProgramacionDetalleNominaResumenComponent } from '../../../modal-programacion-detalle-nomina-resumen/modal-programacion-detalle-nomina-resumen.component';
import { TablaContratosService } from '../../services/tabla-contratos.service';
import { ParametrosApi } from 'src/app/core/interfaces/api.interface';

@Component({
  selector: 'app-tabla-encabezado-prima',
  standalone: true,
  imports: [
    NgbTooltipModule,
    TranslateModule,
    CommonModule,
    ModalProgramacionDetalleNominaResumenComponent,
    ModalProgramacionDetalleEditarContratoComponent,
  ],
  templateUrl: './tabla-encabezado-prima.component.html',
  styleUrl: './tabla-encabezado-prima.component.scss',
})
export class TablaEncabezadoPrimaComponent extends General implements OnInit {
  private readonly _tablaContratosService = inject(TablaContratosService);

  public cantidadRegistros = this._tablaContratosService.cantidadRegistros;
  public ordenamientoValor = this._tablaContratosService.ordernamientoValor;
  public arrProgramacionDetalle =
    this._tablaContratosService.arrProgramacionDetalle;
  public isCheckedSeleccionarTodos =
    this._tablaContratosService.isCheckedSeleccionarTodos;
  public parametrosConsulta = signal<ParametrosApi>({});

  @Input() programacion: ProgramacionRespuesta = {
    id: 0,
    fecha_desde: '',
    fecha_hasta: '',
    fecha_hasta_periodo: '',
    nombre: '',
    dias: 0,
    total: 0,
    descuento_pension: false,
    descuento_salud: false,
    descuento_fondo_solidaridad: false,
    adicional: false,
    descuento_credito: false,
    descuento_embargo: false,
    descuento_retencion_fuente: false,
    pago_auxilio_transporte: false,
    pago_horas: false,
    pago_incapacidad: false,
    pago_licencia: false,
    pago_vacacion: false,
    estado_generado: false,
    estado_aprobado: false,
    devengado: 0,
    deduccion: 0,
    contratos: 0,
    comentario: undefined,
    pago_tipo_id: 0,
    pago_tipo_nombre: '',
    grupo_id: 0,
    grupo_nombre: '',
    periodo_id: 0,
    periodo_nombre: '',
    pago_prima: false,
    pago_interes: false,
    pago_cesantia: false,
  };

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.inicializarParametrosConsulta();
  }

  inicializarParametrosConsulta() {
    this.parametrosConsulta.set({
      programacion_id: this.detalle,
      limit: 1000,
      ordering: 'contrato_id',
    });
  }

  // orderPor(nombre: string, i: number) {
  //   this._tablaContratosService.ordenarPor(nombre);

  //   this.parametrosConsulta.update((parametros) => {
  //     const nuevosOrdenamientos = [...parametros.ordenamientos];
  //     nuevosOrdenamientos[i] = this.ordenamientoValor();
  //     return {
  //       ...parametros,
  //       ordenamientos: nuevosOrdenamientos,
  //     };
  //   });

  //   this._tablaContratosService
  //     .consultarListaContratos(this.parametrosConsulta())
  //     .subscribe();
  // }

  toggleSelectAll(event: Event) {
    const seleccionarTodos = event.target as HTMLInputElement;
    this._tablaContratosService.toggleAllSelectoresEliminar(
      seleccionarTodos.checked,
    );
  }

  agregarRegistrosEliminar(id: number) {
    this._tablaContratosService.agregarRegistrosEliminar(id);
  }

  consultarDatos() {
    this._tablaContratosService
      .consultarListaContratos(this.parametrosConsulta())
      .subscribe();
  }
}
