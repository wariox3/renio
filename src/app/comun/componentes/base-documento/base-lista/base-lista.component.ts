import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal, ViewChild, ViewContainerRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ModalDinamicoComponent } from '@comun/componentes/modal-dinamico/modal-dinamico.component';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { configuracionExtraDocumento } from '@comun/extra/funcionalidades/configuracion-extra-documento';
import { documentos } from '@comun/extra/mapeo-entidades/documentos';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { GeneralService } from '@comun/services/general.service';
import { HttpService } from '@comun/services/http.service';
import { ModalDinamicoService } from '@comun/services/modal-dinamico.service';
import { Modelo } from '@comun/type/modelo.type';
import { ExtraService } from '@modulos/venta/servicios/extra.service';
import { Filtros } from '@interfaces/comunes/componentes/filtros/filtros.interface';
import { Listafiltros } from '@interfaces/comunes/componentes/filtros/lista-filtros.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { BotonesExtras } from '@interfaces/comunes/configuracion-extra/configuracion-extra.interface';
import {
  ArchivosImportar,
  ModeloConfig,
  Rutas,
} from '@interfaces/menu/configuracion.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import {
  BehaviorSubject,
  combineLatest,
  finalize,
  Subject,
  takeUntil,
} from 'rxjs';
import {
  FilterCondition,
  FilterField,
} from 'src/app/core/interfaces/filtro.interface';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';
import { FiltroComponent } from '../../ui/tabla/filtro/filtro.component';
import { RespuestaApi } from 'src/app/core/interfaces/api.interface';
import { ComponentesExtras } from '@comun/extra/funcionalidades/documento-funcionalidad';

@Component({
  selector: 'app-comun-base-lista-documento',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    CardComponent,
    TablaComponent,
    ModalDinamicoComponent,
    FiltroComponent,
  ],
  templateUrl: './base-lista.component.html',
  styleUrls: ['./base-lista.component.scss'],
})
export class BaseListaComponent extends General implements OnInit, OnDestroy {
  private readonly _configModuleService = inject(ConfigModuleService);
  private readonly _generalService = inject(GeneralService);
  private readonly _filterTransformerService = inject(FilterTransformerService);

  private _modulo: string | null;
  private _rutas: Rutas | undefined;
  private _destroy$ = new Subject<void>();
  private _key: null | number | Modelo | undefined;
  public _modelo: Modelo | undefined;
  public _endpoint: string | undefined;
  public ordenamientoFijo = '';
  public modeloConfig: ModeloConfig | null;
  public nombreModelo: string | undefined;
  public _tipo: string = 'DOCUMENTO';
  public importarConfig: ArchivosImportar | undefined;
  public documentoId: number | undefined;
  public filtroKey = signal<string>('');
  public totalItems = signal<number>(0);
  public queryParams: { [key: string]: any } = {};
  public queryParamsStorage: { [key: string]: any } = {};
  public availableFields: FilterField[] = [];

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  componenteDinamico: ViewContainerRef;
  arrParametrosConsulta: ParametrosFiltros = {
    filtros: [],
    modelo: 'GenDocumento',
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
  };
  filtrosDocumento: Filtros[] = [];
  arrPropiedades: Listafiltros[];
  arrItems: any;
  cantidad_registros!: number;
  nombreFiltro: string;
  tipo = '';
  modelo = '';
  titulos: any = [];
  confirmacionRegistrosEliminado = false;
  urlEliminar = '';
  botonGenerar: boolean = false;
  private destroy$ = new Subject<void>();
  botonesExtras: BotonesExtras[] = [];
  nombreComponente: string = '';
  tituloModal: string = '';
  visualizarBtnNuevo = true;
  visualizarColumnaEditar = true;
  visualizarBtnEliminar = true;
  visualizarColumnaSeleccionar = true;
  visualizarBtnImportar = true;
  visualizarBtnExportarZip: boolean;
  visualizarBtnDropdownNuevo: boolean;

  public mostrarVentanaCargando$: BehaviorSubject<boolean>;

  constructor(
    private httpService: HttpService,
    private descargarArchivosService: DescargarArchivosService,
    private modalService: NgbModal,
    private modalDinamicoService: ModalDinamicoService,
    private extraService: ExtraService,
  ) {
    super();
    this.mostrarVentanaCargando$ = new BehaviorSubject(false);
  }

  ngOnInit(): void {
    this._setupConfigModuleListener();
    this.alertaService.cerrarMensajes();
    this.modalDinamicoService.event$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.consultaListaModal();
      });

    // Suscribirse al observable de generación exitosa
    this.extraService.generacionExitosa$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.consultarLista();
      });

    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.unsubscribe();
  }

  private _setupConfigModuleListener() {
    this._configModuleService.currentModelConfig$
      .pipe(takeUntil(this._destroy$))
      .subscribe((value) => {
        this._loadModuleConfiguration(value);
        this._configurarTabla(value);
        this._configurarParametrosConsulta();
        this.consultarLista();
      });
  }

  private _loadModuleConfiguration(modeloConfig: ModeloConfig | null) {
    this.modeloConfig = modeloConfig;
    this.queryParams = this.modeloConfig?.ajustes.queryParams || {};
    this._key = modeloConfig?.key;
    this._modelo = modeloConfig?.ajustes.parametrosHttpConfig?.modelo;
    this.availableFields =
      modeloConfig?.ajustes.parametrosHttpConfig?.filtros?.ui || [];
    this.nombreModelo = modeloConfig?.nombreModelo;
    this._rutas = modeloConfig?.ajustes.rutas;
    this._modulo = this._configModuleService.modulo();
    this._endpoint = modeloConfig?.ajustes.endpoint;
    this.importarConfig = modeloConfig?.ajustes.archivos?.importar;
    this.documentoId = Number(
      modeloConfig?.ajustes.parametrosHttpConfig?.filtros?.lista?.[0].valor1,
    );
    this.filtroKey.set(
      `${this._modulo?.toLocaleLowerCase()}_documento_${modeloConfig?.key}`,
    );
  }

  private _configurarParametrosConsulta() {
    const filtrosLocalStorage = this._getFiltrosLocalstorage();

    if (filtrosLocalStorage.length) {
      const apiParams =
        this._filterTransformerService.transformToApiParams(
          filtrosLocalStorage,
        );
      this.queryParamsStorage = apiParams;
    }
  }

  private _getFiltrosLocalstorage(): FilterCondition[] {
    const filtroGuardado = localStorage.getItem(this.filtroKey());

    if (filtroGuardado) {
      return JSON.parse(filtroGuardado);
    }

    return [];
  }

  private _configurarTabla(modeloConfig: ModeloConfig | null) {
    const verColumnaEditar = modeloConfig?.ajustes.ui?.verColumnaEditar;
    const verBtnNuevo = modeloConfig?.ajustes.ui?.verBotonNuevo;
    const verBtnImportar = modeloConfig?.ajustes.ui?.verBotonImportar;
    const verBtnEliminar = modeloConfig?.ajustes.ui?.verBotonEliminar;
    const verBtnExportarZip = modeloConfig?.ajustes.ui?.verBotonExportarZip;
    const verColumnaSeleccionar =
      modeloConfig?.ajustes.ui?.verColumnaSeleccionar;
    const verDropdownNuevo = modeloConfig?.ajustes.ui?.verDropdownNuevo;

    this.visualizarColumnaEditar = !!verColumnaEditar;
    this.visualizarBtnNuevo = !!verBtnNuevo;
    this.visualizarBtnImportar = !!verBtnImportar;
    this.visualizarBtnEliminar = !!verBtnEliminar;
    this.visualizarBtnExportarZip = !!verBtnExportarZip;
    this.visualizarBtnDropdownNuevo = !!verDropdownNuevo;
    this.visualizarColumnaSeleccionar = !!verColumnaSeleccionar;
    this.construirBotonesExtras(modeloConfig);

    this.store.dispatch(ActualizarMapeo({ dataMapeo: documentos[this._key!] }));
  }

  consultarLista() {
    this.mostrarVentanaCargando$.next(true);
    this.arrItems = [];

    this._generalService
      .consultaApi<RespuestaApi<any>>(`${this._endpoint!}/`, {
        ...this.queryParams,
        ...this.queryParamsStorage,
      })
      .pipe(finalize(() => this.mostrarVentanaCargando$.next(false)))
      .subscribe((respuesta) => {
        this.cantidad_registros = respuesta.count;
        this.arrItems = respuesta.results;
        this.totalItems.set(respuesta.count);
        this.changeDetectorRef.detectChanges();
      });
  }

  construirBotonesExtras(modeloConfig: ModeloConfig | null) {
    let verBotonGenerar = modeloConfig?.ajustes.ui?.verBotonGenerar;

    if (verBotonGenerar) {
      let documentoClase = modeloConfig?.key!;
      this.botonesExtras =
        configuracionExtraDocumento[documentoClase]?.botones || [];
    } else {
      this.botonesExtras = [];
    }

    this.changeDetectorRef.detectChanges();
  }

  async clickBotonExtra(datosBoton: BotonesExtras, content: any) {
    // Si el botón no abre un modal, sino un componente dinámico
    if (datosBoton.esModal !== undefined && datosBoton.esModal === false) {
      const documentoClase = this._configModuleService.key;
      const nombreComponente = datosBoton.componenteNombre;

      if (
        documentoClase &&
        nombreComponente &&
        ComponentesExtras[documentoClase]
      ) {
        const componenteLoaded =
          ComponentesExtras[documentoClase][nombreComponente];
        if (componenteLoaded) {
          const componente = await (await componenteLoaded.componente()).default;
          const componenteCargado: any =
            this.componenteDinamico.createComponent(componente);
          componenteCargado.changeDetectorRef.detectChanges();
          if (typeof componenteCargado.instance.formSubmit === 'function') {
            const observable$ = componenteCargado.instance.formSubmit(datosBoton.registrosSeleccionados);
            if (observable$) {
              observable$.subscribe((respuesta: any) => {
                if (respuesta) {
                  this.alertaService.mensajaExitoso('¡Facturas generadas correctamente!');
                  this.consultarLista(); // refrescar lista, si aplica
                }
              });
            } else {
              console.warn('El método formSubmit no devolvió un observable.');
            }

          } else {
            console.warn('El componente cargado no tiene el método formSubmit');
          }
        }
      } else {
        console.error('documento_clase o nombreComponente no son válidos.');
      }
      return;
    }

    // Si el botón sí abre un modal
    this.abrirModal(datosBoton, content);
  }

  abrirModal(datosBoton: BotonesExtras, content: any) {
    this.nombreComponente = datosBoton.componenteNombre;
    if (datosBoton.configuracionModal) {
      const configuracionModal = datosBoton.configuracionModal;
      this.tituloModal = configuracionModal.titulo;
      this.modalService.open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: configuracionModal.size,
      });
    }
  }

  consultaListaModal() {
    this.modalService.dismissAll();
    this.consultarLista();
  }

  cambiarPaginacion(data: { desplazamiento: number; limite: number }) {
    const savedFiltersString = localStorage.getItem(this.filtroKey());
    let apiParams = {};

    if (savedFiltersString) {
      try {
        const parsed = JSON.parse(savedFiltersString);
        if (Array.isArray(parsed)) {
          apiParams = this._filterTransformerService.transformToApiParams(parsed as FilterCondition[]);
        }
      } catch (e) {
        console.error('Error parsing saved filters:', e);
      }
    }
    this._generalService
      .consultaApi<RespuestaApi<any>>(`${this._endpoint!}/`, {
        ...this.queryParams,
        ...apiParams,
        page: data.desplazamiento,
      })
      .pipe(finalize(() => this.mostrarVentanaCargando$.next(false)))
      .subscribe((respuesta) => {
        this.cantidad_registros = respuesta.count;
        this.arrItems = respuesta.results;
        this.totalItems.set(respuesta.count);
        this.changeDetectorRef.detectChanges();
      });
  }

  eliminarRegistros(data: Number[]) {
    if (data.length > 0) {
      // this.activatedRoute.queryParams
      // .subscribe((parametro) => {
      this.mostrarVentanaCargando$.next(true);
      // const consultaHttp = parametro.consultaHttp;
      // if (consultaHttp === 'si') {
      if (this._modelo === 'GenDocumento') {
        this.httpService
          .post(`${this._endpoint}/eliminar/`, { documentos: data })
          .pipe(
            finalize(() => {
              this.mostrarVentanaCargando$.next(false);
              this.consultarLista();
            }),
          )
          .subscribe((respuesta: any) => {
            this.alertaService.mensajaExitoso(respuesta.mensaje);
          });
      } else {
        const eliminarSolicitudes = data.map((id) => {
          return this.httpService.delete(`${this._endpoint}/${id}/`, {});
        });

        combineLatest(eliminarSolicitudes)
          .pipe(
            finalize(() => {
              this.mostrarVentanaCargando$.next(false);
              this.consultarLista();
            }),
          )
          .subscribe((respuesta: any) => {
            this.alertaService.mensajaExitoso('Registro eliminado');
            this.confirmacionRegistrosEliminado = true;
            this.changeDetectorRef.detectChanges();
          });
      }
    } else {
      this.alertaService.mensajeError(
        'Error',
        'No se han seleccionado registros para eliminar',
      );
    }
  }

  navegarNuevo() {
    this.router.navigate([`${this._rutas?.nuevo}`], {
      queryParams: {
        ...this.parametrosUrl,
      },
    });
  }

  navegarEditar(id: number) {
    this.router.navigate([`${this._rutas?.editar}/${id}`], {
      queryParams: {
        ...this.parametrosUrl,
      },
    });
  }

  navegarDetalle(id: number) {
    this.router.navigate([`${this._rutas?.detalle}/${id}`], {
      queryParams: {
        ...this.parametrosUrl,
      },
    });
  }

  descargarExcel() {
    this.descargarArchivosService.exportarExcel(
      this._endpoint!,
      {
        ...this.queryParamsStorage,
        ...this.queryParams,
      }
    );
  }

  descargarZip() {
    this.descargarArchivosService.descargarZipDocumentos({
      ...this.arrParametrosConsulta,
      zip: true,
      ...{
        limite: 5000,
      },
    });
  }

  filterChange(filters: FilterCondition[]) {
    // Transformar los filtros a parámetros de API
    const apiParams =
      this._filterTransformerService.transformToApiParams(filters);

    this.queryParamsStorage = apiParams;

    this._generalService
      .consultaApi<RespuestaApi<any>>(`${this._endpoint!}/`, {
        ...this.queryParams,
        ...apiParams,
      })
      .pipe(finalize(() => this.mostrarVentanaCargando$.next(false)))
      .subscribe((respuesta) => {
        this.cantidad_registros = respuesta.count;
        this.arrItems = respuesta.results;
        this.totalItems.set(respuesta.count);
        this.changeDetectorRef.detectChanges();
      });
  }
}
