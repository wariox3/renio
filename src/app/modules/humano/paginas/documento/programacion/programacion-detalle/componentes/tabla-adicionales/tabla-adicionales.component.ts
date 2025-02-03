import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal, ViewChild } from '@angular/core';
import { General } from '@comun/clases/general';
import { GeneralService } from '@comun/services/general.service';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { ProgramacionAdicional } from '@modulos/humano/interfaces/programacion-adicional.interface';
import { ProgramacionRespuesta } from '@modulos/humano/interfaces/programacion.interface';
import { RespuestaProgramacionDetalleAdicionales } from '@modulos/humano/interfaces/respuesta-programacion-adicionales.interface';
import { AdicionalService } from '@modulos/humano/servicios/adicional.service';
import { TranslateModule } from '@ngx-translate/core';
import { asignarArchivoImportacionDetalle } from '@redux/actions/archivo-importacion.actions';
import { finalize } from 'rxjs';
import { ModalProgramacionDetalleAdicionalComponent } from '../modal-programacion-detalle-adicional/modal-programacion-detalle-adicional.component';
import { ImportarAdministradorComponent } from '@comun/componentes/importar-administrador/importar-administrador.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalProgramacionEditarAdicionalComponent } from '../modal-programacion-editar-adiciona/modal-programacion-editar-adicional.component';

@Component({
  selector: 'app-tabla-adicionales',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbTooltipModule,
    ImportarAdministradorComponent,
    ModalProgramacionDetalleAdicionalComponent,
    ModalProgramacionEditarAdicionalComponent,
  ],
  templateUrl: './tabla-adicionales.component.html',
  styleUrl: './tabla-adicionales.component.scss',
})
export class TablaAdicionalesComponent extends General {
  registrosAEliminar = signal<number[]>([]);
  arrProgramacionAdicional = signal<RespuestaProgramacionDetalleAdicionales[]>(
    []
  );
  isCheckedSeleccionarTodos = signal(false);
  arrParametrosConsultaAdicionalEditar = signal<ParametrosFiltros>({
    limite: 0,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 0,
    modelo: 'HumProgramacionDetalle',
    filtros: [],
  });
  arrParametrosConsulta = signal<ParametrosFiltros>({
    limite: 0,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 0,
    modelo: 'HumProgramacionDetalle',
    filtros: [],
  });

  private _generalService = inject(GeneralService);
  private _adicionalService = inject(AdicionalService);

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
    pago_cesantia: false
  };
  @ViewChild(ModalProgramacionDetalleAdicionalComponent)
  modalProgramacionDetalleAdicionalComponent: ModalProgramacionDetalleAdicionalComponent;
  @ViewChild(ModalProgramacionEditarAdicionalComponent)
  modalProgramacionEditarAdicionalComponent: ModalProgramacionEditarAdicionalComponent;

  consultarDatos() {
    this.isCheckedSeleccionarTodos.set(false);
    this.store.dispatch(
      asignarArchivoImportacionDetalle({ detalle: 'HumAdicional.xlxs' })
    );
    this.inicializarParametrosConsultaAdicional();
    this._generalService
      .consultarDatosLista<ProgramacionAdicional>(this.arrParametrosConsulta())
      .subscribe((respuesta) => {
        this.arrProgramacionAdicional.set(
          respuesta.registros.map((registro) => ({
            ...registro,
            selected: false,
          }))
        );
        this.changeDetectorRef.detectChanges();
      });
  }

  inicializarParametrosConsultaAdicional() {
    this.arrParametrosConsulta.set({
      filtros: [
        {
          propiedad: 'programacion_id',
          valor1: this.programacion.id,
        },
      ],
      limite: 1000,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'HumAdicional',
    });
  }

  toggleSelectAll(event: Event) {
    const seleccionarTodos = event.target as HTMLInputElement;
    this.isCheckedSeleccionarTodos.update((checked) => (checked = !checked));
    let registros = this.arrProgramacionAdicional();

    if (seleccionarTodos.checked) {
      registros.map((item: RespuestaProgramacionDetalleAdicionales) => {
        item.selected = true;
        const index = this.registrosAEliminar().indexOf(item.id);
        if (index === -1) {
          let registros = this.registrosAEliminar();
          this.registrosAEliminar.set([...registros, item.id]);
        }
      });

      this.arrProgramacionAdicional.set(registros);
    } else {
      registros.map((item: RespuestaProgramacionDetalleAdicionales) => {
        item.selected = false;
      });
      this.arrProgramacionAdicional.set(registros);
      this.registrosAEliminar.set([]);
    }
  }

  agregarRegistrosEliminar(id: number) {
    let registros = this.registrosAEliminar();
    let index = registros.indexOf(id);
    let adicionales = this.arrProgramacionAdicional();

    adicionales.find((contrato: RespuestaProgramacionDetalleAdicionales) => {
      if (contrato.id === id) {
        contrato.selected = !contrato.selected;
      }
    });
    this.arrProgramacionAdicional.set(adicionales);
    if (index !== -1) {
      const updatedRegistros = [...registros];
      updatedRegistros.splice(index, 1);
      this.registrosAEliminar.set(updatedRegistros);
    } else {
      this.registrosAEliminar.set([...registros, id]);
    }
  }

  eliminarRegistros() {
    if (this.registrosAEliminar().length > 0) {
      this.registrosAEliminar().forEach((id) => {
        this._adicionalService
          .eliminarAdicional(id)
          .pipe(
            finalize(() => {
              this.isCheckedSeleccionarTodos.set(false);
            })
          )
          .subscribe(() => {
            this.alertaService.mensajaExitoso('Registro eliminado');
            this.consultarDatos();
          });
      });
    } else {
      this.alertaService.mensajeError(
        'Error',
        'No se han seleccionado registros para eliminar'
      );
    }
    this.registrosAEliminar.set([]);
  }

  abrirModalNuevo(){
    this.modalProgramacionEditarAdicionalComponent.abrirModalNuevo()
  }

  abrirModalEditar(id: number){
    this.modalProgramacionEditarAdicionalComponent.abrirModalEditar(id)
  }

  abrirModalDetalle(id: number){
    this.modalProgramacionDetalleAdicionalComponent.abrirModal(id)

  }
}
