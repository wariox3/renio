import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { BaseEstadosComponent } from '@comun/componentes/base-estados/base-estados.component';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { GeneralService } from '@comun/services/general.service';
import { HttpService } from '@comun/services/http.service';
import { TablaRegistroLista } from '@interfaces/humano/programacion';
import { APORTE_CONTRATO_FILTERS } from '@modulos/humano/domain/mapeo/seguridad-social.mapeo';
import { RespuestaEncabezadoAporteDetalle } from '@modulos/humano/interfaces/aporte-detalle.interface';
import { AporteService } from '@modulos/humano/servicios/aporte.service';
import {
  NgbDropdown,
  NgbDropdownModule,
  NgbNavModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { finalize, of, switchMap, tap } from 'rxjs';
import { FilterCondition } from 'src/app/core/interfaces/filtro.interface';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { FiltroComponent } from '../../../../../../comun/componentes/ui/tabla/filtro/filtro.component';
import { TableDetallesComponent } from './componentes/table-detalles/table-detalles.component';
import { TableEntidadComponent } from './componentes/table-entidad/table-entidad.component';
import { FiltrosDetalleAporteContratos } from './constantes';
import { TablaEntidadService } from './services/tabla-entidad.service';
import { PaginadorComponent } from '@comun/componentes/ui/tabla/paginador/paginador.component';
import {
  ParametrosApi,
  RespuestaApi,
} from 'src/app/core/interfaces/api.interface';

@Component({
  selector: 'app-aporte-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    CardComponent,
    BtnAtrasComponent,
    NgbDropdownModule,
    NgbNavModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    BaseEstadosComponent,
    NgSelectModule,
    TranslateModule,
    TituloAccionComponent,
    TableEntidadComponent,
    FiltroComponent,
    TableDetallesComponent,
    PaginadorComponent,
  ],
  templateUrl: './aporte-detalle.component.html',
  styleUrl: './aporte-detalle.component.scss',
})
export default class AporteDetalleComponent
  extends General
  implements OnInit, OnDestroy
{
  private readonly _tableEntidadService = inject(TablaEntidadService);
  private _filterTransformerService = inject(FilterTransformerService);
  public filtrosContratos = APORTE_CONTRATO_FILTERS;
  active: Number;
  aporte: RespuestaEncabezadoAporteDetalle = {
    id: 0,
    fecha_desde: '',
    fecha_hasta: '',
    fecha_hasta_periodo: '',
    anio: 0,
    mes: 0,
    anio_salud: 0,
    mes_salud: 0,
    presentacion: '',
    estado_generado: false,
    estado_aprobado: false,
    cotizacion_pension: 0.0,
    cotizacion_voluntario_pension_afiliado: 0.0,
    cotizacion_voluntario_pension_aportante: 0.0,
    cotizacion_solidaridad_solidaridad: 0.0,
    cotizacion_solidaridad_subsistencia: 0.0,
    cotizacion_salud: 0.0,
    cotizacion_riesgos: 0.0,
    cotizacion_caja: 0.0,
    cotizacion_sena: 0.0,
    cotizacion_icbf: 0.0,
    cotizacion_total: 0.0,
    contratos: 0,
    empleados: 0,
    lineas: 0,
    sucursal_id: 0,
    sucursal_nombre: '',
    entidad_riesgo_id: 0,
    entidad_riesgo_nombre: '',
    base_cotizacion: 0.0,
    entidad_sena_id: 0,
    entidad_sena_nombre: '',
    entidad_icbf_id: 0,
    entidad_icbf_nombre: '',
  };
  arrAporteDetalle: any = [];
  generando: boolean = false;
  desgenerando: boolean = false;
  cargandoContratos: boolean = false;
  registrosAEliminar: number[] = [];
  isCheckedSeleccionarTodos: boolean = false;
  ordenadoTabla: string = '';
  registroSeleccionado: number;
  registroAdicionalSeleccionado: number;
  formularioAporteContrato: FormGroup;
  parametrosConsultaContratos: ParametrosApi = {};
  cantidadRegistros = signal(0);

  // Nos permite manipular el dropdown desde el codigo
  @ViewChild('OpcionesDropdown', { static: true }) dropdown!: NgbDropdown;
  @ViewChild(TableDetallesComponent)
  tableDetallesComponent: TableDetallesComponent;

  private readonly _generalService = inject(GeneralService);

  constructor(
    private aporteService: AporteService,
    private httpService: HttpService,
    private descargarArchivosService: DescargarArchivosService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.inicializarParametrosConsulta();
    this.consultarDatos();
  }

  ngOnDestroy(): void {
    localStorage.removeItem('documento_aporte');
  }

  inicializarParametrosConsulta() {
    this.parametrosConsultaContratos = {
      aporte_id: this.detalle,
      limit: 1000,
      ordering: 'contrato_id',
    };
  }

  consultarDatosDetalle() {
    this.tableDetallesComponent.consultarDatos();
  }

  consultarDatosEntidades() {
    this._tableEntidadService.inicializarParametros(this.detalle);
    this._tableEntidadService.consultarListaEntidades().subscribe();
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
      documento_tipo_id: 1,
      documento_id: this.detalle,
    });
  }

  navegarEditar(id: number) {
    this.router.navigate([`humano/proceso/editar/${id}`], {
      queryParams: {
        ...this.parametrosUrl,
      },
    });
  }

  navegarNuevo() {
    this.router.navigate([`humano/proceso/nuevo`], {
      queryParams: {
        ...this.parametrosUrl,
      },
    });
  }

  generar() {
    this.generando = true;
    this.aporteService
      .generar({
        id: this.aporte.id,
      })
      .pipe(
        finalize(() => {
          this.generando = false;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe((respuesta) => {
        this.consultarDatos();
        this.tableDetallesComponent?.consultarDatos();
        this._tableEntidadService.consultarListaEntidades().subscribe();
      });
  }

  desgenerar() {
    this.desgenerando = true;
    this.aporteService
      .desgenerar({
        id: this.aporte.id,
      })
      .pipe(
        finalize(() => {
          this.desgenerando = false;
          //this.reiniciarSelectoresEliminar();
          //this.dropdown.close();
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe(() => {
        this.consultarDatos();
        this.tableDetallesComponent?.consultarDatos();
        this._tableEntidadService.consultarListaEntidades().subscribe();
      });
  }

  aprobar() {
    this.alertaService
      .confirmarSinReversa()
      .pipe(
        switchMap((respuesta) => {
          if (respuesta.isConfirmed) {
            return this.httpService.post('humano/aporte/aprobar/', {
              id: this.detalle,
            });
          }
          return of(false);
        }),
        tap((respuesta) => {
          if (respuesta !== false) {
            this.alertaService.mensajaExitoso('Documento aprobado');
            this.aporte.estado_aprobado = true;
            this.consultarDatos();
            this.changeDetectorRef.detectChanges();
          }
        }),
      )
      .subscribe();
  }

  consultarDatos() {
    this.aporteService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.aporte = respuesta;
        this._consultarContratos(this.parametrosConsultaContratos);
      });
  }

  private _consultarContratos(filtros: any) {
    this._generalService
      .consultaApi<RespuestaApi<any>>('humano/aporte_contrato/', {
        aporte_id: this.detalle,
        ...filtros,
      })
      .subscribe((respuesta) => {
        this.cantidadRegistros.set(respuesta.count);
        this.arrAporteDetalle = respuesta.results.map(
          (registro: TablaRegistroLista) => ({
            ...registro,
            selected: false,
          }),
        );

        this.store.dispatch(
          ActualizarMapeo({ dataMapeo: FiltrosDetalleAporteContratos }),
        );

        this.changeDetectorRef.detectChanges();
      });
  }

  descargarExcelContrato() {
    const params = {
      ...this.parametrosConsultaContratos,
      serializador: 'informe_aporte_contrato',
      excel_informe: 'True',
    };

    this.descargarArchivosService.exportarExcel(
      'humano/aporte_contrato',
      params,
    );
    this.dropdown.close();
    this.changeDetectorRef.detectChanges();
  }

  cargarContratos() {
    this.cargandoContratos = true;
    this.aporteService
      .cargarContratos({
        id: this.aporte.id,
      })
      .pipe(
        finalize(() => {
          this.cargandoContratos = false;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe(() => {
        this.consultarDatos();
        this.changeDetectorRef.detectChanges();
      });
  }

  eliminarRegistros() {
    if (this.registrosAEliminar.length > 0) {
      this.registrosAEliminar.forEach((id) => {
        this.aporteService
          .eliminarRegistro(id, {})
          .pipe(
            finalize(() => {
              this.isCheckedSeleccionarTodos = false;
            }),
          )
          .subscribe(() => {
            this.alertaService.mensajaExitoso('Registro eliminado');
            this.consultarDatos();
          });
      });
    } else {
      this.alertaService.mensajeError(
        'Error',
        'No se han seleccionado registros para eliminar',
      );
    }

    this.registrosAEliminar = [];

    this.changeDetectorRef.detectChanges();
  }

  toggleSelectAll(event: Event) {
    const seleccionarTodos = event.target as HTMLInputElement;
    this.isCheckedSeleccionarTodos = !this.isCheckedSeleccionarTodos;
    // Itera sobre todos los datos
    if (seleccionarTodos.checked) {
      this.arrAporteDetalle.forEach((item: TablaRegistroLista) => {
        // Establece el estado de selección de cada registro
        item.selected = !item.selected;
        // Busca el índice del registro en el array de registros a eliminar
        const index = this.registrosAEliminar.indexOf(item.id);
        // Si el registro ya estaba en el array de registros a eliminar, lo elimina
        if (index === -1) {
          this.registrosAEliminar.push(item.id);
        } // Si el registro no estaba en el array de registros a eliminar, lo agrega
      });
    } else {
      this.arrAporteDetalle.forEach((item: TablaRegistroLista) => {
        // Establece el estado de selección de cada registro
        item.selected = !item.selected;
      });

      this.registrosAEliminar = [];
    }

    this.changeDetectorRef.detectChanges();
  }

  // funcionalidades de eliminar registros
  agregarRegistrosEliminar(id: number) {
    // Busca el índice del registro en el array de registros a eliminar
    const index = this.registrosAEliminar.indexOf(id);
    // Si el registro ya está en el array, lo elimina
    if (index !== -1) {
      this.registrosAEliminar.splice(index, 1);
    } else {
      // Si el registro no está en el array, lo agrega
      this.registrosAEliminar.push(id);
    }
  }

  generarPlanoOperador() {
    this.aporteService.planoOperador({
      id: this.detalle,
    });
  }

  cambiarPaginacion(page: number) {
    this.parametrosConsultaContratos = {
      ...this.parametrosConsultaContratos,
      page: page,
    };

    this._consultarContratos(this.parametrosConsultaContratos);
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
    this.aporteService.desaprobar({ id: documentoId }).subscribe({
      next: () => {
        this.consultarDatos();
        this.alertaService.mensajaExitoso('Documento desaprobado con exito!');
      },
    });
  }

  filterChange(filters: FilterCondition[]) {
    const apiParams =
      this._filterTransformerService.transformToApiParams(filters);
    this._consultarContratos(apiParams);
  }
}
