import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { BaseFiltroComponent } from '@comun/componentes/base-filtro/base-filtro.component';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { GeneralService } from '@comun/services/general.service';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { ProgramacionContratos } from '@modulos/humano/interfaces/programacion-contratos.interface';
import { ProgramacionRespuesta } from '@modulos/humano/interfaces/programacion.interface';
import { RespuestaProgramacionContrato } from '@modulos/humano/interfaces/respuesta-programacion-contratos.interface';
import { ProgramacionDetalleService } from '@modulos/humano/servicios/programacion-detalle.service';
import { ProgramacionService } from '@modulos/humano/servicios/programacion.service';
import {
  NgbDropdown,
  NgbDropdownModule,
  NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { finalize, tap } from 'rxjs';
import { FiltrosDetalleProgramacionContratos } from '../../constantes';
import { ModalProgramacionDetalleNominaResumenComponent } from '../modal-programacion-detalle-nomina-resumen/modal-programacion-detalle-nomina-resumen.component';
import { ModalProgramacionDetalleEditarContratoComponent } from "../modal-programacion-detalle-editar-contrato/modal-programacion-detalle-editar-contrato.component";
import { PaginadorComponent } from '@comun/componentes/paginador/paginador.component';

@Component({
  selector: 'app-tabla-contratos',
  standalone: true,
  imports: [
    BaseFiltroComponent,
    PaginadorComponent,
    NgbDropdownModule,
    NgbTooltipModule,
    TranslateModule,
    CommonModule,
    ModalProgramacionDetalleNominaResumenComponent,
    ModalProgramacionDetalleEditarContratoComponent
],
  templateUrl: './tabla-contratos.component.html',
  styleUrl: './tabla-contratos.component.scss',

})
export class TablaContratosComponent extends General implements OnInit {
  cantidadRegistros = signal(0);
  ordenadoTabla = signal('');
  cargandoContratos = signal(false);
  isCheckedSeleccionarTodos = signal(false);
  arrParametrosConsulta = signal<ParametrosFiltros>({
    limite: 0,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 0,
    modelo: 'HumProgramacionDetalle',
    filtros: [],
  });
  arrProgramacionDetalle = signal<RespuestaProgramacionContrato[]>([]);
  registrosAEliminar = signal<number[]>([]);
  registroSeleccionado = signal<number>(0);

  private _descargarArchivosService = inject(DescargarArchivosService);
  private _generalService = inject(GeneralService);
  private _programacionService = inject(ProgramacionService);
  private _programacionDetalleService = inject(ProgramacionDetalleService);

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
  };
  @ViewChild('OpcionesDropdown', { static: true }) dropdown!: NgbDropdown;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.inicializarParametrosConsulta();
    this.consultarDatos();
  }

  consultarDatos() {
    this.reiniciarSelectoresEliminar();
    this._generalService
      .consultarDatosLista<ProgramacionContratos>(this.arrParametrosConsulta())
      .pipe(
        tap((respuesta) => {
          this.cantidadRegistros.set(respuesta.cantidad_registros);
          this.arrProgramacionDetalle.set(
            respuesta.registros.map(
              (registro: RespuestaProgramacionContrato) => ({
                ...registro,
                selected: false,
              })
            )
          );
        })
      )
      .subscribe();
    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: FiltrosDetalleProgramacionContratos })
    );
  }

  obtenerFiltrosContratos(data: any[]) {
    this.inicializarParametrosConsulta();
    if (data.length > 0) {
      this.arrParametrosConsulta.update((parametros) => ({
        ...parametros,
        filtros: [...parametros.filtros, ...data],
      }));
    } else {
      this.inicializarParametrosConsulta();
    }
    this.consultarDatos();
  }

  inicializarParametrosConsulta() {
    this.arrParametrosConsulta.set({
      filtros: [
        {
          operador: '',
          propiedad: 'programacion_id',
          valor1: this.detalle,
          valor2: '',
        },
      ],
      limite: 1000,
      desplazar: 0,
      ordenamientos: ['contrato_id'],
      limite_conteo: 10000,
      modelo: 'HumProgramacionDetalle',
    });
    let filtroDetalleContratos = localStorage.getItem(`documento_programacion`);
    if (filtroDetalleContratos !== null) {
      let filtroPermanente = JSON.parse(filtroDetalleContratos);
      this.arrParametrosConsulta.update((arrParametrosConsulta) => ({
        ...arrParametrosConsulta,
        filtros: [...arrParametrosConsulta.filtros, ...filtroPermanente],
      }));
    }
  }

  cambiarPaginacion(data: { desplazamiento: number; limite: number }) {
    this.arrParametrosConsulta.update((arrParametrosConsulta) => ({
      ...arrParametrosConsulta,
      limite: data.desplazamiento,
      desplazar: data.limite,
    }));
    this.consultarDatos();
  }

  cambiarDesplazamiento(desplazamiento: number) {
    this.arrParametrosConsulta.update((arrParametrosConsulta) => ({
      ...arrParametrosConsulta,
      desplazar: desplazamiento,
    }));
    this.consultarDatos();
  }

  descargarExcelDetalle() {
    const modelo = 'HumProgramacionDetalle';
    const params = {
      modelo,
      serializador: 'Excel',
      excel: true,
      filtros: [{ propiedad: 'programacion_id', valor1: this.programacion.id }],
      limite: 10000,
    };
    let filtroDetalleContratos = localStorage.getItem(`documento_programacion`);
    if (filtroDetalleContratos !== null) {
      let filtroPermanente = JSON.parse(filtroDetalleContratos);
      this.arrParametrosConsulta.update((arrParametrosConsulta) => ({
        ...arrParametrosConsulta,
        filtros: [...arrParametrosConsulta.filtros, ...filtroPermanente],
      }));
    }
    this._descargarArchivosService.descargarExcelAdminsitrador(modelo, params);
    this.dropdown.close();
  }

  descargarExcelNomina() {
    const modelo = 'GenDocumento';
    const params = {
      modelo,
      serializador: 'NominaExcel',
      excel: true,
      filtros: [
        {
          propiedad: 'programacion_detalle__programacion_id',
          valor1: this.programacion.id,
        },
      ],
      limite: 10000,
    };
    this._descargarArchivosService.descargarExcelAdminsitrador(modelo, params);
    this.dropdown.close();
  }

  descargarExcelNominaDetalle() {
    const modelo = 'GenDocumentoDetalle';
    const params = {
      modelo,
      serializador: 'NominaExcel',
      excel: true,
      filtros: [
        {
          propiedad: 'documento__programacion_detalle__programacion_id',
          valor1: this.programacion.id,
        },
      ],
      limite: 10000,
    };
    this._descargarArchivosService.descargarExcelAdminsitrador(modelo, params);
    this.dropdown.close();
  }

  cargarContratos() {
    this.reiniciarSelectoresEliminar();
    this.cargandoContratos.set(true);
    this._programacionService
      .cargarContratos({
        id: this.programacion.id,
      })
      .pipe(
        tap(() => {
          this.consultarDatos();
        }),
        finalize(() => {
          this.cargandoContratos.set(false);
        })
      )
      .subscribe();
  }

  eliminarRegistros() {
    if (this.registrosAEliminar().length > 0) {
      this.registrosAEliminar().forEach((id) => {
        this._programacionDetalleService
          .eliminarRegistro(id, {})
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

  orderPor(nombre: string, i: number) {
    if (this.ordenadoTabla().charAt(0) == '-') {
      this.ordenadoTabla.set(nombre.toLowerCase());
    } else {
      this.ordenadoTabla.set(`-${nombre.toLowerCase()}`);
    }

    this.arrParametrosConsulta.update((parametros) => {
      const nuevosOrdenamientos = [...parametros.ordenamientos];
      nuevosOrdenamientos[i] = this.ordenadoTabla();

      return {
        ...parametros,
        ordenamientos: nuevosOrdenamientos,
      };
    });

    this.consultarDatos();
  }

  toggleSelectAll(event: Event) {
    const seleccionarTodos = event.target as HTMLInputElement;
    this.isCheckedSeleccionarTodos.update((checked) => (checked = !checked));
    let registros = this.arrProgramacionDetalle();

    if (seleccionarTodos.checked) {
      registros.map((item: RespuestaProgramacionContrato) => {
        item.selected = true;
        const index = this.registrosAEliminar().indexOf(item.id);
        if (index === -1) {
          let registros = this.registrosAEliminar();
          this.registrosAEliminar.set([...registros, item.id]);
        }
      });

      this.arrProgramacionDetalle.set(registros);
    } else {
      registros.map((item: RespuestaProgramacionContrato) => {
        item.selected = false;
      });
      this.arrProgramacionDetalle.set(registros);
      this.registrosAEliminar.set([]);
    }
  }

  abrirModalDeEditarRegistro(content: any, id: number) {
    this.registroSeleccionado.set(id);
    // this.iniciarFormularioEditarDetalles();
    // this.inicializarParametrosConsultaProgramacionDetalleEditar(id);
    // this.consultarRegistroDetalleProgramacion();
    // this.changeDetectorRef.detectChanges();
  }

  agregarRegistrosEliminar(id: number) {
    let registros = this.registrosAEliminar();
    let index = registros.indexOf(id);
    let contratos = this.arrProgramacionDetalle();

    contratos.find((contrato: RespuestaProgramacionContrato) => {
      if (contrato.id === id) {
        contrato.selected = !contrato.selected;
      }
    });
    this.arrProgramacionDetalle.set(contratos);
    if (index !== -1) {
      const updatedRegistros = [...registros];
      updatedRegistros.splice(index, 1);
      this.registrosAEliminar.set(updatedRegistros);
    } else {
      this.registrosAEliminar.set([...registros, id]);
    }
  }

  reiniciarSelectoresEliminar() {
    this.isCheckedSeleccionarTodos.set(false);
    this.registrosAEliminar.set([]);
    this.isCheckedSeleccionarTodos.set(false);
  }
}
