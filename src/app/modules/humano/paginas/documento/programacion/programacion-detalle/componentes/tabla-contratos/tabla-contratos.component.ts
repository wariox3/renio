import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { BaseFiltroComponent } from '@comun/componentes/base-filtro/base-filtro.component';
import { PaginadorComponent } from '@comun/componentes/paginador/paginador.component';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { ProgramacionRespuesta } from '@modulos/humano/interfaces/programacion.interface';
import { RespuestaProgramacionContrato } from '@modulos/humano/interfaces/respuesta-programacion-contratos.interface';
import { ProgramacionDetalleService } from '@modulos/humano/servicios/programacion-detalle.service';
import { ProgramacionService } from '@modulos/humano/servicios/programacion.service';
import {
  NgbDropdown,
  NgbDropdownModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { finalize, forkJoin, tap } from 'rxjs';
import { TablaEncabezadoCesantiaComponent } from './componentes/tabla-encabezado-cesantia/tabla-encabezado-cesantia.component.component';
import { TablaEncabezadoGeneralComponent } from './componentes/tabla-encabezado-general/tabla-encabezado-general.component';
import { TablaEncabezadoPrimaComponent } from './componentes/tabla-encabezado-prima/tabla-encabezado-prima.component';
import { TablaContratosService } from './services/tabla-contratos.service';

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
    TablaEncabezadoPrimaComponent,
    TablaEncabezadoGeneralComponent,
    TablaEncabezadoCesantiaComponent,
  ],
  templateUrl: './tabla-contratos.component.html',
  styleUrl: './tabla-contratos.component.scss',
})
export class TablaContratosComponent extends General implements OnInit {
  private _descargarArchivosService = inject(DescargarArchivosService);
  private _programacionService = inject(ProgramacionService);
  private _programacionDetalleService = inject(ProgramacionDetalleService);
  private _tablaContratosService = inject(TablaContratosService);

  cantidadRegistros = computed(() =>
    this._tablaContratosService.cantidadRegistros(),
  );
  ordenadoTabla = signal('');
  cargandoContratos = signal(false);
  isCheckedSeleccionarTodos =
    this._tablaContratosService.isCheckedSeleccionarTodos;
  arrParametrosConsulta = signal<ParametrosFiltros>({
    limite: 0,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 0,
    modelo: 'HumProgramacionDetalle',
    filtros: [],
  });
  arrProgramacionDetalle = signal<RespuestaProgramacionContrato[]>([]);
  registrosAEliminar = this._tablaContratosService.registrosAEliminar;
  registroSeleccionado = signal<number>(0);

  @Output() emitirEventoConsultarLista = new EventEmitter<void>();
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
  @ViewChild('OpcionesDropdown', { static: true }) dropdown!: NgbDropdown;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.inicializarParametrosConsulta();
    this.consultarDatos();
  }

  consultarDatos() {
    this._tablaContratosService
      .consultarListaContratos(this.arrParametrosConsulta())
      .subscribe();
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
          propiedad: 'programacion_id',
          valor1: this.detalle,
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
      filtros: [
        {
          propiedad: 'programacion_id',
          operador: 'exact',
          valor1: this.programacion.id,
        },
      ],
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
          operador: 'exact',
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
          operador: 'exact',
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
          this.emitirEventoConsultarLista.emit();
        }),
      )
      .subscribe();
  }

  eliminarRegistros() {
    if (this.registrosAEliminar().length > 0) {
      const eliminarSolicitudes = this.registrosAEliminar().map((id) => {
        return this._programacionDetalleService.eliminarRegistro(id, {});
      });

      forkJoin(eliminarSolicitudes)
        .pipe(
          finalize(() => {
            this.isCheckedSeleccionarTodos.set(false);
            this.emitirEventoConsultarLista.emit();
          }),
        )
        .subscribe(() => {
          this.alertaService.mensajaExitoso('Registro eliminado');
        });
    } else {
      this.alertaService.mensajeError(
        'Error',
        'No se han seleccionado registros para eliminar',
      );
    }
    this.registrosAEliminar.set([]);
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
