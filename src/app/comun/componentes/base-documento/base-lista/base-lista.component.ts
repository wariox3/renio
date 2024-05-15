import { DescargarArchivosService } from './../../../services/descargarArchivos.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { Listafiltros } from '@interfaces/comunes/filtros';
import { documentos } from '@comun/extra/mapeoEntidades/documentos';
import { CardComponent } from '@comun/componentes/card/card.component';
import { BaseFiltroComponent } from '@comun/componentes/base-filtro/base-filtro.component';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { ImportarComponent } from '@comun/componentes/importar/importar.component';
import { ActualizarMapeo } from '@redux/actions/menu.actions';

@Component({
  selector: 'app-comun-base-lista',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    TranslationModule,
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
  nombreFiltro = `${localStorage.getItem('itemTipo')}_${localStorage.getItem(
    'itemNombre'
  )}`;
  tipo = '';
  modelo = '';
  titulos: any = [];
  confirmacionRegistrosEliminado = false;
  urlEliminar = '';
  documento_clase_id: string;

  constructor(
    private httpService: HttpService,
    private descargarArchivosService: DescargarArchivosService
  ) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.nombreFiltro = `documento_${localStorage
        .getItem('itemNombre')
        ?.toLowerCase()}`;
      this.modelo = localStorage.getItem('itemNombre')!;
      let posicion: keyof typeof documentos = parseInt(
        parametro.documento_clase
      );
      this.store.dispatch(ActualizarMapeo({ dataMapeo: documentos[posicion] }));
      this.consultarLista();
    });
    this.changeDetectorRef.detectChanges();
  }

  consultarLista() {
    const { documento_clase: documento_clase_id } = this.parametrosUrl;

    const filtroGuardado = localStorage.getItem(this.nombreFiltro);

    if (filtroGuardado) {
      this.arrParametrosConsulta.filtros = JSON.parse(filtroGuardado);
    } else if (this.arrParametrosConsulta.filtros.length > 0) {
      this.arrParametrosConsulta.filtros = [];
    }
    this.httpService
      .post<{
        registros: any;
      }>('general/documento/lista/', {
        ...this.arrParametrosConsulta,
        ...{
          documento_clase_id,
        },
      })
      .subscribe((respuesta: any) => {
        this.cantidad_registros = respuesta.length
        this.arrItems = respuesta;
        this.changeDetectorRef.detectChanges();
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
    this.consultarLista();
  }

  cambiarDesplazamiento(desplazamiento: number) {
    this.arrParametrosConsulta.desplazar = desplazamiento;
    this.consultarLista();
  }

  eliminarRegistros(data: Number[]) {
    if (data.length > 0) {
      this.httpService
        .post('general/documento/eliminar/', { documentos: data })
        .subscribe((respuesta: any) => {
          this.alertaService.mensajaExitoso(respuesta.mensaje);
          this.consultarLista();
        });
    } else {
      this.alertaService.mensajeError(
        'Error',
        'No se han seleccionado registros para eliminar'
      );
    }
  }

  navegarNuevo() {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.router.navigate([`/documento/nuevo`], {
        queryParams: {
          ...parametro,
        },
      });
    });
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
    const { documento_clase: documento_clase_id } = this.parametrosUrl;
    this.descargarArchivosService.descargarExcelDocumentos({
      ...this.arrParametrosConsulta,
      ...{
        documento_clase_id,
        limite: 5000
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
