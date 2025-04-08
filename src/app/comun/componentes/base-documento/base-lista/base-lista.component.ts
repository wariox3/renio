import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Params, RouterModule } from '@angular/router';
import { General } from '@comun/clases/general';
import { BaseFiltroComponent } from '@comun/componentes/base-filtro/base-filtro.component';
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
import { Listafiltros } from '@interfaces/comunes/componentes/filtros/lista-filtros.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { BotonesExtras } from '@interfaces/comunes/configuracion-extra/configuracion-extra.interface';
import { ModeloConfig, Rutas } from '@interfaces/menu/configuracion.interface';
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

@Component({
  selector: 'app-comun-base-lista-documento',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    CardComponent,
    BaseFiltroComponent,
    TablaComponent,
    ModalDinamicoComponent,
  ],
  templateUrl: './base-lista.component.html',
  styleUrls: ['./base-lista.component.scss'],
})
export class BaseListaComponent extends General implements OnInit, OnDestroy {
  private readonly _configModuleService = inject(ConfigModuleService);
  private readonly _generalService = inject(GeneralService);

  private _modulo: string | null;
  private _rutas: Rutas | undefined;
  private _destroy$ = new Subject<void>();
  private _endpoint: string | undefined;
  private _key: null | number | Modelo | undefined;
  public _modelo: Modelo | undefined;
  public ordenamientoFijo = '';
  public modeloCofig: ModeloConfig | null;
  public nombreModelo: string | undefined;
  public _tipo: string = 'DOCUMENTO';

  arrParametrosConsulta: ParametrosFiltros = {
    filtros: [],
    modelo: 'GenDocumento',
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
  };
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

  public mostrarVentanaCargando$: BehaviorSubject<boolean>;

  constructor(
    private httpService: HttpService,
    private descargarArchivosService: DescargarArchivosService,
    private modalService: NgbModal,
    private modalDinamicoService: ModalDinamicoService,
  ) {
    super();
    this.mostrarVentanaCargando$ = new BehaviorSubject(false);
  }

  ngOnInit(): void {
    this._setupConfigModuleListener();

    this.alertaService.cerrarMensajes();
    this.activatedRoute.queryParams.subscribe((parametro) => {
      // this.arrParametrosConsulta.desplazar = 0;
      // this.arrParametrosConsulta.ordenamientos = [];
      // this.visualizarColumnaEditar =
      //   parametro.visualizarColumnaEditar === 'no' ? false : true;
      // this.visualizarBtnNuevo =
      //   parametro.visualizarBtnNuevo === 'no' ? false : true;
      // this.visualizarBtnEliminar =
      //   parametro.visualizarBtnEliminar === 'no' ? false : true;
      // this.visualizarColumnaSeleccionar =
      //   parametro.visualizarColumnaSeleccionar === 'no' ? false : true;
      // this.visualizarBtnImportar =
      //   parametro.visualizarBtnImportar === 'no' ? false : true;
      // this.visualizarBtnExportarZip =
      //   parametro.visualizarBtnExportarZip === 'si' ? true : false;

      // this.nombreFiltro = `documento_${parametro.itemNombre?.toLowerCase()}`;
      // this.modelo = parametro.itemNombre!;
      // if (parametro?.ordenamiento) {
      //   let ordenamientos = parametro.ordenamiento
      //     .split(',')
      //     .map((palabra: string) => palabra.trim());
      //   this.arrParametrosConsulta.ordenamientos = ordenamientos;
      // } else {
      //   this.arrParametrosConsulta.ordenamientos = [];
      // }
      // let posicion: keyof typeof documentos = parametro.documento_clase;
      // this.store.dispatch(ActualizarMapeo({ dataMapeo: documentos[posicion] }));
      // this.consultarLista();
      this.construirBotonesExtras(parametro);
    });

    this.modalDinamicoService.event$
      .pipe(takeUntil(this.destroy$))
      .subscribe((respuesta) => {
        this.consultaListaModal();
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
        this._reiniciarParametrosConsulta();
        this._configurarTabla(value);
        this._configurarParametrosConsulta(value);
        this.consultarLista();
      });
  }

  private _loadModuleConfiguration(modeloConfig: ModeloConfig | null) {
    this.modeloCofig = modeloConfig;
    this._key = modeloConfig?.key;
    this._modelo = modeloConfig?.ajustes.parametrosHttpConfig?.modelo;
    this.nombreModelo = modeloConfig?.nombreModelo;
    this._rutas = modeloConfig?.ajustes.rutas;
    this._modulo = this._configModuleService.modulo();
    this._endpoint = modeloConfig?.ajustes.endpoint;
    this.nombreFiltro = `documento_${this._modelo?.toLowerCase()}`;
  }

  private _reiniciarParametrosConsulta() {
    this.arrParametrosConsulta = {
      filtros: [],
      modelo: 'GenDocumento',
      limite: 50,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
    };
  }

  private _configurarParametrosConsulta(modeloConfig: ModeloConfig | null) {
    const httpConfig = modeloConfig?.ajustes.parametrosHttpConfig;

    if (httpConfig?.ordenamientos) {
      this.arrParametrosConsulta.ordenamientos.push(
        ...httpConfig?.ordenamientos,
      );
    }

    if (this._modelo) {
      this.arrParametrosConsulta = {
        ...this.arrParametrosConsulta,
        modelo: this._modelo,
      };
    }

    if (httpConfig?.filtros?.lista?.length) {
      this.arrParametrosConsulta = {
        ...this.arrParametrosConsulta,
        filtros: httpConfig?.filtros?.lista,
      };
    }

    if (httpConfig?.serializador) {
      this.arrParametrosConsulta = {
        ...this.arrParametrosConsulta,
        serializador: httpConfig?.serializador,
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

  private _configurarTabla(modeloConfig: ModeloConfig | null) {
    // this.visualizarColumnaEditar =
    //   this.moduloConfiguracion?.data?.visualizarColumnaEditar === 'no'
    //     ? false
    //     : true;

    // this.visualizarBtnNuevo =
    //   this.moduloConfiguracion?.data?.visualizarBtnNuevo === 'no'
    //     ? false
    //     : true;

    // this.visualizarColumnaEditar =
    //     parametro.visualizarColumnaEditar === 'no' ? false : true;
    // this.visualizarBtnNuevo =
    //   parametro.visualizarBtnNuevo === 'no' ? false : true;
    // this.visualizarBtnEliminar =
    //   parametro.visualizarBtnEliminar === 'no' ? false : true;
    // this.visualizarColumnaSeleccionar =
    //   parametro.visualizarColumnaSeleccionar === 'no' ? false : true;
    // this.visualizarBtnImportar =
    //   parametro.visualizarBtnImportar === 'no' ? false : true;
    // this.visualizarBtnExportarZip =
    //   parametro.visualizarBtnExportarZip === 'si' ? true : false;

    const verColumnaEditar = modeloConfig?.ajustes.ui?.verColumnaEditar;
    const verBtnNuevo = modeloConfig?.ajustes.ui?.verBotonNuevo;
    const verBtnImportar = modeloConfig?.ajustes.ui?.verBotonImportar;
    const verBtnEliminar = modeloConfig?.ajustes.ui?.verBotonEliminar;
    const verBtnExportarZip = modeloConfig?.ajustes.ui?.verBotonExportarZip;
    const verColumnaSeleccionar =
      modeloConfig?.ajustes.ui?.verColumnaSeleccionar;

    this.visualizarColumnaEditar = !!verColumnaEditar;
    this.visualizarBtnNuevo = !!verBtnNuevo;
    this.visualizarBtnImportar = !!verBtnImportar;
    this.visualizarBtnEliminar = !!verBtnEliminar;
    this.visualizarBtnExportarZip = !!verBtnExportarZip;
    this.visualizarColumnaSeleccionar = !!verColumnaSeleccionar;

    this.store.dispatch(ActualizarMapeo({ dataMapeo: documentos[this._key!] }));
  }

  consultarLista() {
    this.mostrarVentanaCargando$.next(true);
    this.arrItems = [];

    this._generalService
      .consultarDatosLista(this.arrParametrosConsulta)
      .pipe(finalize(() => this.mostrarVentanaCargando$.next(false)))
      .subscribe((respuesta: any) => {
        this.cantidad_registros = respuesta.cantidad_registros;
        this.arrItems = respuesta.registros;
        this.changeDetectorRef.detectChanges();
      });
  }

  // TODO: preguntar sobre los filtros fijos
  // consultarLista() {
  //   this.mostrarVentanaCargando$.next(true);
  //   this.arrItems = [];
  //   this.activatedRoute.queryParams
  //     .subscribe((parametro) => {
  //       const filtroGuardado = localStorage.getItem(this.nombreFiltro);
  //       const filtroPermanenteStr = localStorage.getItem(
  //         `${this.nombreFiltro}_filtro_lista_fijo`,
  //       );

  //       let consultaHttp: string = parametro.consultaHttp!;
  //       let ordenamientoFijo: any[] = parametro?.ordenamiento;
  //       let filtroPermamente: any = [];
  //       if (filtroPermanenteStr !== null) {
  //         filtroPermamente = JSON.parse(filtroPermanenteStr);
  //       }

  //       if (consultaHttp === 'si') {
  //         this.arrParametrosConsulta.modelo = 'GenDocumento';
  //         this.arrParametrosConsulta.filtros = [
  //           {
  //             propiedad: 'documento_tipo__documento_clase_id',
  //             valor1: parametro.documento_clase,
  //           },
  //         ];
  //         if (filtroGuardado !== null) {
  //           this.arrParametrosConsulta.filtros = [
  //             {
  //               propiedad: 'documento_tipo__documento_clase_id',
  //               valor1: parametro.documento_clase,
  //             },
  //             ...filtroPermamente,
  //             ...JSON.parse(filtroGuardado),
  //           ];
  //         }
  //         if (parametro.serializador) {
  //           this.arrParametrosConsulta.serializador = parametro.serializador;
  //         } else {
  //           delete this.arrParametrosConsulta.serializador;
  //         }
  //         this.httpService
  //           .post<{
  //             registros: any;
  //             cantidad_registros: number;
  //           }>('general/funcionalidad/lista/', this.arrParametrosConsulta)
  //           .pipe(finalize(() => this.mostrarVentanaCargando$.next(false)))
  //           .subscribe((respuesta) => {
  //             this.cantidad_registros = respuesta.cantidad_registros;
  //             this.arrItems = respuesta.registros;
  //             this.changeDetectorRef.detectChanges();
  //           });
  //       } else {
  //         let baseUrl = 'general/funcionalidad/lista/';
  //         this.arrParametrosConsulta.modelo = parametro.documento_clase;
  //         this.arrParametrosConsulta.ordenamientos = [];

  //         if (filtroGuardado !== null) {
  //           this.arrParametrosConsulta.filtros = [
  //             ...filtroPermamente, // Combinar el array parseado de filtros permanentes
  //             ...JSON.parse(filtroGuardado), // y el array de filtros guardados
  //           ];
  //         } else {
  //           this.arrParametrosConsulta.filtros = [
  //             ...filtroPermamente, // Combinar el array parseado de filtros permanentes
  //           ];
  //         }
  //         if (
  //           ordenamientoFijo !== undefined &&
  //           !this.arrParametrosConsulta.ordenamientos.includes(ordenamientoFijo)
  //         ) {
  //           this.arrParametrosConsulta.ordenamientos.push(ordenamientoFijo);
  //         }
  //         if (parametro.serializador) {
  //           this.arrParametrosConsulta.serializador = parametro.serializador;
  //         } else {
  //           delete this.arrParametrosConsulta.serializador;
  //         }

  //         this.httpService
  //           .post<{
  //             cantidad_registros: number;
  //             registros: any[];
  //             propiedades: any[];
  //           }>(baseUrl, this.arrParametrosConsulta)
  //           .pipe(finalize(() => this.mostrarVentanaCargando$.next(false)))
  //           .subscribe((respuesta: any) => {
  //             this.cantidad_registros = respuesta.cantidad_registros;
  //             this.arrItems = respuesta.registros;
  //             this.arrPropiedades = respuesta.propiedades;

  //             this.changeDetectorRef.detectChanges();
  //           });
  //       }
  //     })
  //     .unsubscribe();
  // }

  construirBotonesExtras(parametros: Params) {
    let configuracionExtra: string = parametros.configuracionExtra!;

    if (configuracionExtra === 'si') {
      let documentoClase: number = Number(parametros.documento_clase);
      this.botonesExtras =
        configuracionExtraDocumento[documentoClase]?.botones || [];
    } else {
      this.botonesExtras = [];
    }

    this.changeDetectorRef.detectChanges();
  }

  abrirModal(datosBoton: BotonesExtras, content: any) {
    this.nombreComponente = datosBoton.componenteNombre;
    const configuracionModal = datosBoton.configuracionModal;
    this.tituloModal = configuracionModal.titulo;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: configuracionModal.size,
    });
  }

  obtenerFiltros(arrfiltros: any[]) {
    if (arrfiltros.length >= 1) {
      this.arrParametrosConsulta.filtros = arrfiltros;
    } else {
      localStorage.removeItem(this.nombreFiltro);
    }
    this.changeDetectorRef.detectChanges();
    this.consultarLista();
  }

  consultaListaModal() {
    this.modalService.dismissAll();
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
      // } else {
      // let modelo = this.modelo.toLowerCase();
      // let modulo = localStorage.getItem('ruta');
      // let eliminarPrefijos = ['hum', 'gen', 'con', 'inv'];
      // if (
      //   eliminarPrefijos.includes(
      //     this.modelo.toLowerCase().substring(0, 3),
      //   )
      // ) {
      //   modelo = this.modelo
      //     .toLowerCase()
      //     .substring(3, this.modelo.length);
      // }
      // }
      // })
      // .unsubscribe();
    } else {
      this.alertaService.mensajeError(
        'Error',
        'No se han seleccionado registros para eliminar',
      );
    }
  }

  navegarNuevo() {
    // this.navegarDocumentoNuevo();
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
        // detalle: id,
      },
    });
  }

  navegarDetalle(id: number) {
    this.router.navigate([`${this._rutas?.detalle}/${id}`], {
      queryParams: {
        ...this.parametrosUrl,
        // detalle: id,
      },
    });
  }

  descargarExcel() {
    this.descargarArchivosService.descargarExcelDocumentos({
      ...this.arrParametrosConsulta,
      excel: true,
      serializador: 'Excel',
      ...{
        limite: 5000,
      },
    });
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
}
