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
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { PROGRAMACION_DETALLE_FILTERS } from '@modulos/humano/domain/mapeo/programacion-detalle.mapeo';
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
import { ParametrosApi } from 'src/app/core/interfaces/api.interface';
import { FilterCondition } from 'src/app/core/interfaces/filtro.interface';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';
import { FiltroComponent } from '../../../../../../../../comun/componentes/ui/tabla/filtro/filtro.component';
import { PaginadorComponent } from '../../../../../../../../comun/componentes/ui/tabla/paginador/paginador.component';
import { TablaEncabezadoCesantiaComponent } from './componentes/tabla-encabezado-cesantia/tabla-encabezado-cesantia.component.component';
import { TablaEncabezadoGeneralComponent } from './componentes/tabla-encabezado-general/tabla-encabezado-general.component';
import { TablaEncabezadoPrimaComponent } from './componentes/tabla-encabezado-prima/tabla-encabezado-prima.component';
import { TablaContratosService } from './services/tabla-contratos.service';

@Component({
  selector: 'app-tabla-contratos',
  standalone: true,
  imports: [
    NgbDropdownModule,
    NgbTooltipModule,
    TranslateModule,
    CommonModule,
    TablaEncabezadoPrimaComponent,
    TablaEncabezadoGeneralComponent,
    TablaEncabezadoCesantiaComponent,
    FiltroComponent,
    PaginadorComponent,
  ],
  templateUrl: './tabla-contratos.component.html',
  styleUrl: './tabla-contratos.component.scss',
})
export class TablaContratosComponent extends General implements OnInit {
  private _descargarArchivosService = inject(DescargarArchivosService);
  private _programacionService = inject(ProgramacionService);
  private _programacionDetalleService = inject(ProgramacionDetalleService);
  private _tablaContratosService = inject(TablaContratosService);
  private _filterTransformerService = inject(FilterTransformerService);

  PROGRAMACION_DETALLE_FILTERS = PROGRAMACION_DETALLE_FILTERS;
  cantidadRegistros = computed(() =>
    this._tablaContratosService.cantidadRegistros(),
  );
  ordenadoTabla = signal('');
  cargandoContratos = signal(false);
  currentPage = signal(1);
  isCheckedSeleccionarTodos =
    this._tablaContratosService.isCheckedSeleccionarTodos;
  arrParametrosConsulta = signal<ParametrosApi>({
    // modelo: 'HumProgramacionDetalle',
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

  filterChange(filters: FilterCondition[]) {
    const apiParams =
      this._filterTransformerService.transformToApiParams(filters);

    if (Object.keys(apiParams).length > 0) {
      this.arrParametrosConsulta.update((parametros) => ({
        ...parametros,
        ...apiParams,
      }));
    }

    this.consultarDatos();
  }

  // obtenerFiltrosContratos(data: any[]) {
  //   this.inicializarParametrosConsulta();
  //   if (data.length > 0) {
  //     this.arrParametrosConsulta.update((parametros) => ({
  //       ...parametros,
  //       filtros: [...parametros.filtros, ...data],
  //     }));
  //   } else {
  //     this.inicializarParametrosConsulta();
  //   }
  //   this.consultarDatos();
  // }

  inicializarParametrosConsulta() {
    this.arrParametrosConsulta.set({
      programacion_id: this.detalle,
      ordering: 'contrato_id',
      limit: 1000,
      // modelo: 'HumProgramacionDetalle',
    });

    let filtroDetalleContratos = localStorage.getItem(`documento_programacion`);
    if (filtroDetalleContratos !== null) {
      let filtroPermanente = JSON.parse(filtroDetalleContratos);
      // this.arrParametrosConsulta.update((arrParametrosConsulta) => ({
      //   ...arrParametrosConsulta,
      //   filtros: [...arrParametrosConsulta.filtros, ...filtroPermanente],
      // }));
    }
  }

  cambiarPaginacion(page: number) {
    this.currentPage.set(page);
    this.arrParametrosConsulta.update((arrParametrosConsulta) => ({
      ...arrParametrosConsulta,
      page: page,
    }));

    this.consultarDatos();
  }

  descargarExcelDetalle() {
    const params: ParametrosApi = {
      serializador: 'informe_programacion_detalle',
      excel_informe: 'True',
      programacion_id: this.programacion.id,
    };
    let filtroDetalleContratos = localStorage.getItem(`documento_programacion`);
    if (filtroDetalleContratos !== null) {
      let filtroPermanente = JSON.parse(filtroDetalleContratos);
      // this.arrParametrosConsulta.update((arrParametrosConsulta) => ({
      //   ...arrParametrosConsulta,
      //   filtros: [...arrParametrosConsulta.filtros, ...filtroPermanente],
      // }));
    }
    this._descargarArchivosService.exportarExcel(
      'humano/programacion_detalle',
      params,
    );
    this.dropdown.close();
  }

  descargarExcelNomina() {
    const params: ParametrosApi = {
      serializador: 'informe_nomina',
      excel_informe: 'True',
      programacion_detalle__programacion_id: this.programacion.id,
    };

    this._descargarArchivosService.exportarExcel('general/documento', params);
    this.dropdown.close();
  }

  descargarExcelNominaDetalle() {
    const params: ParametrosApi = {
      serializador: 'informe_nomina_detalle',
      excel_informe: 'True',
      documento__programacion_detalle__programacion_id: this.programacion.id,
    };

    this._descargarArchivosService.exportarExcel('general/documento_detalle', params);
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
