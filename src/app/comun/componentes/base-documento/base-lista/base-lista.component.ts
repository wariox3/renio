import { DescargarArchivosService } from './../../../services/descargarArchivos.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Params, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { Listafiltros } from '@interfaces/comunes/filtros';
import { documentos } from '@comun/extra/mapeoEntidades/documentos';
import { CardComponent } from '@comun/componentes/card/card.component';
import { BaseFiltroComponent } from '@comun/componentes/base-filtro/base-filtro.component';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { ImportarComponent } from '@comun/componentes/importar/importar.component';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDinamicoComponent } from '@comun/componentes/modal-dinamico/modal-dinamico.component';
import { ModalDinamicoService } from '@comun/services/modal-dinamico.service';
import { BotonesExtras } from '@interfaces/comunes/configuracionExtra';
import { configuracionExtraDocumento } from '@comun/extra/funcionalidades/configuracion-extra-documento';

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
    ImportarComponent,
    ModalDinamicoComponent
  ],
  templateUrl: './base-lista.component.html',
  styleUrls: ['./base-lista.component.scss'],
})
export class BaseListaComponent extends General implements OnInit, OnDestroy {
  arrParametrosConsulta: any = {
    filtros: [],
    modelo: '',
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
  botonGenerar: boolean = false
  private destroy$ = new Subject<void>()
  botonesExtras: BotonesExtras[] = []
  nombreComponente: string = ''
  tituloModal: string = ''
  visualizarBtnNuevo = true;
  visualizarColumnaEditar = true;
  visualizarBtnEliminar = true;
  visualizarColumnaSeleccionar = true;
  visualizarBtnImportar = true;

  constructor(
    private httpService: HttpService,
    private descargarArchivosService: DescargarArchivosService,
    private modalService: NgbModal,
    private modalDinamicoService: ModalDinamicoService
  ) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.visualizarColumnaEditar = parametro.visualizarColumnaEditar === 'no' ?  false : true
      this.visualizarBtnNuevo =  parametro.visualizarBtnNuevo === 'no' ? false : true
      this.visualizarBtnEliminar =  parametro.visualizarBtnEliminar === 'no' ? false : true
      this.visualizarColumnaSeleccionar =  parametro.visualizarColumnaSeleccionar === 'no' ? false : true
      this.visualizarBtnImportar =  parametro.visualizarBtnImportar === 'no' ? false : true

      this.nombreFiltro = `documento_${parametro.itemNombre?.toLowerCase()}`;
      this.modelo = parametro.itemNombre!;
      if (parametro?.ordemaiento) {
        this.arrParametrosConsulta.ordenamientos[0] = parametro?.ordenamiento
      } else {
        this.arrParametrosConsulta.ordenamientos = []
      }
      let posicion: keyof typeof documentos = parametro.documento_clase;
      this.store.dispatch(ActualizarMapeo({ dataMapeo: documentos[posicion] }));
      this.consultarLista();
      this.construirBotonesExtras(parametro)
    });

    this.modalDinamicoService.event$.pipe(takeUntil(this.destroy$)).subscribe(respuesta => {
      this.consultaListaModal()
    })

    this.changeDetectorRef.detectChanges();
  }

  consultarLista() {
    this.activatedRoute.queryParams.subscribe((parametro) => {

      const filtroGuardado = localStorage.getItem(this.nombreFiltro);
      let consultaHttp: string = parametro.consultaHttp!;
      let ordemientoFijo: any[] = parametro?.ordemaiento;
      if (consultaHttp === 'si') {
          this.arrParametrosConsulta.modelo = 'GenDocumento'
          this.arrParametrosConsulta.filtros = [
            {
              propiedad: 'documento_tipo__documento_clase_id',
              valor1: parametro.documento_clase,
            },
          ];
        if (filtroGuardado !== null) {
          this.arrParametrosConsulta.filtros = [
            {
              propiedad: 'documento_tipo__documento_clase_id',
              valor1: parametro.documento_clase,
            },
            ...JSON.parse(filtroGuardado),
          ];
        }
        if(parametro.serializador){
          this.arrParametrosConsulta.serializador = parametro.serializador
        } else {
          delete this.arrParametrosConsulta.serializador
        }
        this.httpService
          .post<{
            registros: any;
          }>('general/funcionalidad/lista/', this.arrParametrosConsulta)
          .subscribe((respuesta: any) => {
            this.cantidad_registros = respuesta.length;
            this.arrItems = respuesta.registros;
            this.changeDetectorRef.detectChanges();
          });
      } else {
        let baseUrl = 'general/funcionalidad/lista/';
        this.arrParametrosConsulta = {
          modelo: parametro.documento_clase,
          ordenamientos: []
        };
        if (filtroGuardado !== null) {
          this.arrParametrosConsulta.filtros = [...JSON.parse(filtroGuardado)];
        }
        if (ordemientoFijo !== undefined) {
          this.arrParametrosConsulta.ordenamientos = [ordemientoFijo]
        } else {
          this.arrParametrosConsulta.ordenamientos = []
        }
        if(parametro.serializador){
          this.arrParametrosConsulta.serializador = parametro.serializador
        } else {
          delete this.arrParametrosConsulta.serializador
        }
        this.httpService
          .post<{
            cantidad_registros: number;
            registros: any[];
            propiedades: any[];
          }>(baseUrl, this.arrParametrosConsulta)
          .subscribe((respuesta: any) => {
            this.cantidad_registros = respuesta.cantidad_registros;
            this.arrItems = respuesta.registros;
            this.arrPropiedades = respuesta.propiedades;

            this.changeDetectorRef.detectChanges();
          });
      }
    }).unsubscribe();
  }

  construirBotonesExtras (parametros: Params) {
    let configuracionExtra: string = parametros.configuracionExtra!;


    if(configuracionExtra === 'si') {
      let documentoClase: number = Number(parametros.documento_clase);
      this.botonesExtras = configuracionExtraDocumento[documentoClase]?.botones || []
    } else {
      this.botonesExtras = []
    }

    this.changeDetectorRef.detectChanges();
  }

  abrirModal (datosBoton: BotonesExtras, content: any) {
    this.nombreComponente = datosBoton.componenteNombre
    const configuracionModal = datosBoton.configuracionModal
    this.tituloModal = configuracionModal.titulo
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
    this.modalService.dismissAll()
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
      this.activatedRoute.queryParams.subscribe((parametro) => {
        const consultaHttp = parametro.consultaHttp;
        if (consultaHttp === 'si') {
          this.httpService
            .post('general/documento/eliminar/', { documentos: data })
            .subscribe((respuesta: any) => {
              this.alertaService.mensajaExitoso(respuesta.mensaje);
              this.consultarLista();
            });
        } else {
          let modelo = this.modelo.toLowerCase();
          let modulo = localStorage.getItem('ruta');
          let eliminarPrefijos = ['hum', 'gen', 'con', 'inv'];
          if (
            eliminarPrefijos.includes(this.modelo.toLowerCase().substring(0, 3))
          ) {
            modelo = this.modelo.toLowerCase().substring(3, this.modelo.length);
          }
          const eliminarSolicitudes = data.map((id) => {
            return this.httpService.delete(
              `${modulo?.toLocaleLowerCase()}/${modelo}/${id}/`,
              {}
            );
          });
          combineLatest(eliminarSolicitudes).subscribe((respuesta: any) => {
            this.alertaService.mensajaExitoso('Registro eliminado');
            this.confirmacionRegistrosEliminado = true;
            this.changeDetectorRef.detectChanges();
            this.consultarLista();
          });
        }
      });
    } else {
      this.alertaService.mensajeError(
        'Error',
        'No se han seleccionado registros para eliminar'
      );
    }
  }

  navegarNuevo() {
    this.navegarDocumentoNuevo();
  }

  navegarEditar(id: number) {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.router.navigate([`/documento/editar`], {
        queryParams: {
          ...parametro,
          detalle: id,
        },
      });
    });
  }

  navegarDetalle(id: number) {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.router.navigate([`/documento/detalle`], {
        queryParams: {
          ...parametro,
          detalle: id,
        },
      });
    });
  }

  descargarExcel() {
    this.descargarArchivosService.descargarExcelDocumentos({
      ...this.arrParametrosConsulta,
      excel: true,
      ...{
        limite: 5000,
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.unsubscribe()
  }

  // imprimir() {
  //   this.httpService
  //     .descargarArchivo(
  //       'general/documento/imprimir/',
  //       this.arrParametrosConsulta
  //     )
  //     .subscribe((data) => {
  //       const blob = new Blob([data], { type: 'application/pdf' });
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = `${this.activatedRoute.snapshot.queryParams['modelo']}.pdf`;
  //       document.body.appendChild(a);
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //     });
  // }
}
