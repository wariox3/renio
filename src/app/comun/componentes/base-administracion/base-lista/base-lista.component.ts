import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { General } from '@comun/clases/general';
import { BaseFiltroComponent } from '@comun/componentes/base-filtro/base-filtro.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { mapeo } from '@comun/extra/mapeo-entidades/administradores';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { GeneralService } from '@comun/services/general.service';
import { HttpService } from '@comun/services/http.service';
import { UrlService } from '@comun/services/infrastructure/url.service';
import { Modelo } from '@comun/type/modelo.type';
import { Filtros } from '@interfaces/comunes/componentes/filtros/filtros.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import {
  ArchivosImportar,
  ModeloConfig,
} from '@interfaces/menu/configuracion.interface';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { BehaviorSubject, finalize, forkJoin, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-comun-base-lista-administrador',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    CardComponent,
    BaseFiltroComponent,
    TablaComponent,
  ],
  templateUrl: './base-lista.component.html',
  styleUrls: ['./base-lista.component.scss'],
})
export class BaseListaComponent extends General implements OnInit, OnDestroy {
  private readonly _configModule = inject(ConfigModuleService);
  private readonly _generalService = inject(GeneralService);

  arrParametrosConsulta: ParametrosFiltros = {
    filtros: [],
    modelo: 'GenItem',
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
  };

  arrItems: any[];
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

  private _filtrosModuloPermanentes: Filtros[] = [];
  private _urlService = inject(UrlService);
  public _modelo: Modelo | undefined;
  private _modulo: string | null;
  private _destroy$ = new Subject<void>();
  public ordenamientoFijo = '';
  public modeloCofig: ModeloConfig | null;
  public _endpoint: string | undefined;
  public nombreModelo: string | undefined;
  public documentoId: number | undefined;
  public importarConfig: ArchivosImportar | undefined;

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

  // private _setupQueryParamsListener() {
  // this.activatedRoute.queryParams.subscribe(() => {
  // console.log(this.nombreFiltro, this._modelo, this._modulo);
  // if (parametro.submodelo) {
  //   this.submodelo = parametro.submodelo!; // esto no va
  //   const filtro = [
  //     // estos son filtros permanentes
  //     {
  //       propiedad: 'empleado',
  //       valor1: true,
  //     },
  //   ];
  //   this.arrParametrosConsulta.filtros = filtro;
  //   this._filtrosModuloPermanentes = filtro;
  // } else {
  //   this.submodelo = undefined;
  //   this.arrParametrosConsulta.filtros = [];
  // }
  // if (parametro.resoluciontipo) {
  //   const filtro = [
  //     {
  //       propiedad: parametro.resoluciontipo,
  //       valor1: true,
  //     },
  //   ];
  //   this.arrParametrosConsulta.filtros = filtro;
  //   this._filtrosModuloPermanentes = filtro;
  // }
  //   });
  // }

  private _setupConfigModuleListener() {
    this._configModule.currentModelConfig$
      .pipe(takeUntil(this._destroy$))
      .subscribe((value) => {
        this._loadModuleConfiguration(value);
        this._reiniciarParametrosConsulta();
        this._configurarTabla(value);
        this._configurarParametrosConsulta(value);
        this.consultarLista();
      });
  }

  private _loadModuleConfiguration(modeloConfig: ModeloConfig | null) {
    this.modeloCofig = modeloConfig;
    this._modelo = modeloConfig?.ajustes.parametrosHttpConfig?.modelo;
    this.nombreModelo = modeloConfig?.nombreModelo;
    this._modulo = this._configModule.modulo();
    this._endpoint = modeloConfig?.ajustes.endpoint;
    this.importarConfig = modeloConfig?.ajustes.archivos?.importar;
    this.documentoId = Number(
      modeloConfig?.ajustes.parametrosHttpConfig?.filtros?.lista?.[0].valor1,
    );
    this.nombreFiltro = `administrador_${this._modelo?.toLowerCase()}`;
  }

  private _configurarTabla(modeloConfig: ModeloConfig | null) {
    // this.visualizarColumnaEditar =
    //   this.moduloConfiguracion?.data?.visualizarColumnaEditar === 'no'
    //     ? false
    //     : true;

    // this.visualizarBtnNuevo =
    //   this.moduloConfiguracion?.data?.visualizarBtnNuevo === 'no'
    //     ? false
    //     : true;
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

  private _configurarParametrosConsulta(modeloConfig: ModeloConfig | null) {
    const parametrosConfig = modeloConfig?.ajustes.parametrosHttpConfig;

    if (parametrosConfig?.ordenamientos?.length) {
      this.arrParametrosConsulta.ordenamientos.push(
        ...parametrosConfig?.ordenamientos,
      );
    }

    if (this._modelo) {
      this.arrParametrosConsulta = {
        ...this.arrParametrosConsulta,
        modelo: this._modelo,
      };
    }

    if (parametrosConfig?.filtros?.lista) {
      this.arrParametrosConsulta = {
        ...this.arrParametrosConsulta,
        filtros: [
          ...this.arrParametrosConsulta.filtros,
          ...parametrosConfig.filtros.lista,
        ],
      };
    }

    // 1. Obtener el ordenamiento de forma segura
    // const ordenamientoActual = this.parametrosUrl?.ordenamiento;
    // // 2. Validar y preparar nuevos ordenamientos (inmutabilidad)
    // const ordenamientosExistentes =
    //   this.arrParametrosConsulta.ordenamientos ?? [];
    // const nuevosOrdenamientos =
    //   ordenamientoActual &&
    //   !ordenamientosExistentes.includes(ordenamientoActual)
    //     ? [...ordenamientosExistentes, ordenamientoActual]
    //     : ordenamientosExistentes;
    // // 3. Crear nuevo objeto de parámetros (totalmente inmutable)
    // this.arrParametrosConsulta = {
    //   ...this.arrParametrosConsulta,
    //   ordenamientos: nuevosOrdenamientos,
    //   modelo: this._modelo, // Asumiendo que _modelo siempre existe
    // };
  }

  // private _obtenerFuncionalidadURL() {
  //   this._basePath = this._urlService.obtenerModuloPath(this.router.url);
  // }

  consultarLista() {
    this.cargando$.next(true);
    this.arrItems = [];
    // let filtroPermamente: any = [];
    // let baseUrl = 'general/funcionalidad/lista/';

    // let ordenamientoFijo = this.parametrosUrl?.ordenamiento;

    // if (
    //   ordenamientoFijo !== undefined &&
    //   !this.arrParametrosConsulta.ordenamientos.includes(ordenamientoFijo)
    // ) {
    //   this.arrParametrosConsulta.ordenamientos.push(ordenamientoFijo);
    // }

    this._generalService
      .consultarDatosLista(this.arrParametrosConsulta)
      .pipe(finalize(() => this.cargando$.next(false)))
      .subscribe((respuesta: any) => {
        this.cantidad_registros = respuesta.cantidad_registros;
        this.arrItems = respuesta.registros;
        this.changeDetectorRef.detectChanges();
      });

    // this.httpService
    //   .post<{
    //     cantidad_registros: number;
    //     registros: any[];
    //     propiedades: any[];
    //   }>(baseUrl, this.arrParametrosConsulta)
    //   .pipe(finalize(() => this.cargando$.next(false)))
    //   .subscribe((respuesta: any) => {
    //     this.cantidad_registros = respuesta.cantidad_registros;
    //     this.arrItems = respuesta.registros;
    //     this.arrPropiedades = respuesta.propiedades;
    //     this.changeDetectorRef.detectChanges();
    //   });
  }

  obtenerFiltros(arrfiltros: Filtros[]) {
    if (arrfiltros.length >= 1) {
      this.arrParametrosConsulta.filtros = arrfiltros;
    } else {
      this.arrParametrosConsulta.filtros = [];
    }

    // cargamos los filtros predeterminados del modulo para no perderlos al limpiar
    if (this._filtrosModuloPermanentes.length > 0) {
      this.arrParametrosConsulta.filtros = [
        ...this.arrParametrosConsulta.filtros,
        ...this._filtrosModuloPermanentes,
      ];
    }

    this.changeDetectorRef.detectChanges();
    this.consultarLista();
  }

  cambiarOrdemiento(ordenamiento: string) {
    (this.arrParametrosConsulta.ordenamientos[0] = ordenamiento),
      this.consultarLista();
  }

  cambiarPaginacion(data: { desplazamiento: number; limite: number }) {
    this.arrParametrosConsulta.limite = data.desplazamiento;
    this.arrParametrosConsulta.desplazar = data.limite;
    this.changeDetectorRef.detectChanges();
    this.consultarLista();
  }

  cambiarDesplazamiento(desplazamiento: number) {
    this.arrParametrosConsulta.desplazar = desplazamiento;
    this.consultarLista();
  }

  eliminarRegistros(data: Number[]) {
    if (data.length > 0) {
      // let modelo = this._modelo;
      // let eliminarPrefijos = ['hum', 'gen', 'con', 'inv'];
      // if (
      //   eliminarPrefijos.includes(this._modelo!.toLowerCase().substring(0, 3))
      // ) {
      //   modelo = this._camelASnake(
      //     this.modelo.substring(3, this.modelo.length),
      //   );
      // }
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
    this.activatedRoute.queryParams
      .subscribe((parametro) => {
        let modelo = parametro.itemTipo!;
        this.descargarArchivosService.descargarExcelAdminsitrador(modelo, {
          ...this.arrParametrosConsulta,
          excel: true,
          ...{
            limite: 5000,
          },
        });
      })
      .unsubscribe();
  }

  // private _adaptadorDataFiltrosPermanente(data: any): any[] {
  //   return Object.keys(data).map((key) => {
  //     let valorAdaptado: any;

  //     if (data[key] === 'si') {
  //       valorAdaptado = true;
  //     } else if (data[key] === 'no') {
  //       valorAdaptado = false;
  //     } else {
  //       valorAdaptado = data[key]; // Mantén el valor original si no es 'si' o 'no'
  //     }

  //     return {
  //       propiedad: key,
  //       valor1: valorAdaptado,
  //     };
  //   });
  // }

  // private _camelASnake(value: string) {
  //   return value.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  // }
}
