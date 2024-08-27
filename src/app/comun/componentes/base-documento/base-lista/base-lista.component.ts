import { DescargarArchivosService } from './../../../services/descargarArchivos.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
import { combineLatest } from 'rxjs';

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
  ],
  templateUrl: './base-lista.component.html',
  styleUrls: ['./base-lista.component.scss'],
})
export class BaseListaComponent extends General implements OnInit {
  arrParametrosConsulta: any = {
    filtros: [],
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

  constructor(
    private httpService: HttpService,
    private descargarArchivosService: DescargarArchivosService
  ) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.nombreFiltro = `documento_${parametro.itemNombre?.toLowerCase()}`;
      this.modelo = parametro.itemNombre!;
      let posicion: keyof typeof documentos = parametro.documento_clase;
      this.store.dispatch(ActualizarMapeo({ dataMapeo: documentos[posicion] }));
      this.consultarLista();
    });
    this.changeDetectorRef.detectChanges();
  }

  consultarLista() {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      const { documento_clase } = parametro;
      const filtroGuardado = localStorage.getItem(this.nombreFiltro);
      let consultaHttp: string = parametro.consultaHttp!;
      let ordemiento: string[] = parametro?.ordemaiento;

      if (consultaHttp === 'si') {
        this.arrParametrosConsulta.filtros = [
          {
            propiedad: 'documento_tipo__documento_clase_id',
            valor1: documento_clase,
          },
        ];
        if (filtroGuardado !== null) {
          this.arrParametrosConsulta.filtros = [
            {
              propiedad: 'documento_tipo__documento_clase_id',
              valor1: documento_clase,
            },
            ...JSON.parse(filtroGuardado),
          ];
        }
        this.httpService
          .post<{
            registros: any;
          }>('general/documento/lista/', this.arrParametrosConsulta)
          .subscribe((respuesta: any) => {
            this.cantidad_registros = respuesta.length;
            this.arrItems = respuesta;
            this.changeDetectorRef.detectChanges();
          });
      } else {
        let baseUrl = 'general/funcionalidad/lista/';
        this.arrParametrosConsulta = {
          modelo: documento_clase,
        };
        if (filtroGuardado !== null) {
          this.arrParametrosConsulta.filtros = [...JSON.parse(filtroGuardado)];
        }
        if (ordemiento !== undefined) {
          this.arrParametrosConsulta.ordemientos = [ordemiento]
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
      ...{
        limite: 5000,
      },
    });
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
