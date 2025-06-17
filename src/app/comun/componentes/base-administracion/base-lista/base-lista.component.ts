import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { mapeo } from '@comun/extra/mapeo-entidades/administradores';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { GeneralService } from '@comun/services/general.service';
import { HttpService } from '@comun/services/http.service';
import { Modelo } from '@comun/type/modelo.type';
import { Filtros } from '@interfaces/comunes/componentes/filtros/filtros.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import {
  ArchivosImportar,
  ModeloConfig,
} from '@interfaces/menu/configuracion.interface';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { BehaviorSubject, finalize, forkJoin, Subject, takeUntil } from 'rxjs';
import { FilterCondition, FilterField } from 'src/app/core/interfaces/filtro.interface';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';
import { FiltroComponent } from "../../ui/tabla/filtro/filtro.component";

@Component({
  selector: 'app-comun-base-lista-administrador',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    CardComponent,
    TablaComponent,
    FiltroComponent
],
  templateUrl: './base-lista.component.html',
  styleUrls: ['./base-lista.component.scss'],
})
export class BaseListaComponent extends General implements OnInit, OnDestroy {
  private readonly _configModule = inject(ConfigModuleService);
  private readonly _generalService = inject(GeneralService);
  private readonly _filterTransformerService = inject(FilterTransformerService);

  arrParametrosConsulta: ParametrosFiltros = {
    filtros: [],
    modelo: 'GenItem',
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
  };

  arrItems: any[];
  filtrosDocumento: Filtros[] = [];
  cantidad_registros!: number;
  nombreFiltro = ``;
  tipo = '';
  modelo = '';
  modulo = '';
  titulos: any = [];
  confirmacionRegistrosEliminado = false;
  urlEliminar = '';
  documento_clase_id: string;
  visualizarBtnNuevo: boolean = true;
  visualizarColumnaEditar = true;
  visualizarBtnImportar = true;
  submodelo: string | undefined;
  cargando$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  moduloConfiguracion: ModeloConfig | undefined;

  public _modelo: Modelo | undefined;
  private _modulo: string | null;
  private _destroy$ = new Subject<void>();
  public ordenamientoFijo = '';
  public modeloCofig: ModeloConfig | null;
  public _endpoint: string | undefined;
  public nombreModelo: string | undefined;
  public importarConfig: ArchivosImportar | undefined;
  public availableFields: FilterField[] = [];
  public queryParams: { [key: string]: any } = {};
  public totalItems = signal<number>(0);
  public filtrosAplicados: { [key: string]: any } = {};

  constructor(
    private httpService: HttpService,
    private descargarArchivosService: DescargarArchivosService,
  ) {
    super();
  }

  ngOnInit(): void {
    this._setupConfigModuleListener();

    // TODO: preguntar pa que cerrar mensajes
    this.alertaService.cerrarMensajes();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.unsubscribe();
  }

  private _setupConfigModuleListener() {
    this._configModule.currentModelConfig$
      .pipe(takeUntil(this._destroy$))
      .subscribe((value) => {
        this._loadModuleConfiguration(value);
        this._reiniciarParametrosConsulta();
        this._configurarTabla(value);
        this.consultarLista();
      });
  }

  private _loadModuleConfiguration(modeloConfig: ModeloConfig | null) {
    this.modeloCofig = modeloConfig;
    this._modelo = modeloConfig?.ajustes.parametrosHttpConfig?.modelo;
    this.availableFields =
      modeloConfig?.ajustes.parametrosHttpConfig?.filtros?.ui || [];
    this.nombreModelo = modeloConfig?.nombreModelo;
    this.queryParams = modeloConfig?.ajustes.queryParams || {};
    this._modulo = this._configModule.modulo();
    this._endpoint = modeloConfig?.ajustes.endpoint;
    this.importarConfig = modeloConfig?.ajustes.archivos?.importar;
    this.nombreFiltro = `administrador_${this._modelo?.toLowerCase()}`;
  }

  private _configurarTabla(modeloConfig: ModeloConfig | null) {
    const verColumnaEditar = modeloConfig?.ajustes.ui?.verColumnaEditar;
    const verBtnNuevo = modeloConfig?.ajustes.ui?.verBotonNuevo;
    const verBtnImportar = modeloConfig?.ajustes.ui?.verBotonImportar;

    this.visualizarColumnaEditar = !!verColumnaEditar;
    this.visualizarBtnNuevo = !!verBtnNuevo;
    this.visualizarBtnImportar = !!verBtnImportar;

    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: mapeo[this._modelo!].datos }),
    );
  }

  private _reiniciarParametrosConsulta() {
    this.arrParametrosConsulta = {
      filtros: [],
      modelo: 'GenItem',
      limite: 50,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
    };
  }

  consultarLista() {
    this.cargando$.next(true);
    this.arrItems = [];
    this._generalService
      .consultaApi(`${this._endpoint}/`, {
        ...this.queryParams,
      })
      .pipe(finalize(() => this.cargando$.next(false)))
      .subscribe((respuesta) => {
        this.cantidad_registros = respuesta.count;
        this.arrItems = respuesta.results;
        this.totalItems.set(respuesta.count);
        this.changeDetectorRef.detectChanges();
      });
  }

  cambiarPaginacion(data: { desplazamiento: number; limite: number }) {
    this._generalService
      .consultaApi(`${this._endpoint!}/`, {
        ...this.queryParams,
        page: data.desplazamiento,
      })
      .subscribe((respuesta) => {
        this.cantidad_registros = respuesta.count;
        this.arrItems = respuesta.results;
        this.totalItems.set(respuesta.count);
        this.changeDetectorRef.detectChanges();
      });
  }
  
  eliminarRegistros(data: Number[]) {
    if (data.length > 0) {
      this.cargando$.next(true);
      const eliminarSolicitudes = data.map((id) => {
        return this.httpService.delete(`${this._endpoint}/${id}/`, {});
      });
      forkJoin(eliminarSolicitudes)
        .pipe(
          finalize(() => {
            this.cargando$.next(false);
            this.consultarLista();
          }),
        )
        .subscribe((respuesta: any) => {
          this.alertaService.mensajaExitoso('Registro eliminado');
          this.confirmacionRegistrosEliminado = true;
          this.changeDetectorRef.detectChanges();
        });
    } else {
      this.alertaService.mensajeError(
        'Error',
        'No se han seleccionado registros para eliminar',
      );
    }
  }

  navegarNuevo() {
    this.router.navigate([`${this._modulo}/administracion/nuevo`], {
      queryParams: {
        ...this.parametrosUrl,
      },
    });
  }

  navegarEditar(id: number) {
    this.router.navigate([`${this._modulo}/administracion/editar/${id}`], {
      queryParams: {
        ...this.parametrosUrl,
        // detalle: id,
      },
    });
  }

  navegarDetalle(id: number) {
    this.router.navigate([`${this._modulo}/administracion/detalle/${id}`], {
      queryParams: {
        ...this.parametrosUrl,
        // detalle: id,
      },
    });
  }

  descargarExcel() {
    this.descargarArchivosService.exportarExcel(
      this._endpoint!,
      {
        ...this.queryParams,
        ...this.filtrosAplicados,
      }
    );
  }

   filterChange(filters: FilterCondition[]) {
      const apiParams =
        this._filterTransformerService.transformToApiParams(filters);
    

      this.filtrosAplicados = apiParams;

      this._generalService
        .consultaApi(`${this._endpoint!}/`, {
          ...this.queryParams,
          ...apiParams,
        })
        .subscribe((respuesta) => {
          this.cantidad_registros = respuesta.count;
          this.arrItems = respuesta.results;
          this.totalItems.set(respuesta.count);
          this.changeDetectorRef.detectChanges();
        });
    }
}
