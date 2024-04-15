import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { CardComponent } from '../card/card.component';
import { BaseFiltroComponent } from '../base-filtro/base-filtro.component';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { Listafiltros } from '@interfaces/comunes/filtros';
import { TablaComponent } from '../tabla/tabla.component';
import { combineLatest } from 'rxjs';
import { ImportarComponent } from '../importar/importar.component';
import { Componetes } from '@comun/extra/imports';
import { mapeo } from '@comun/extra/mapeoEntidades';

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
    modelo: '',
    tipo: '',
  };
  arrPropiedades: Listafiltros[];
  arrItems: any[];
  cantidad_registros!: number;
  nombreFiltro = '';
  tipo = '';
  modelo = '';
  titulos: any = [];
  confirmacionRegistrosEliminado = false;
  urlEliminar = '';
  documento_tipo_id: string;
  constructor(private httpService: HttpService) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      let data = JSON.parse(parametro.data);
      this.documento_tipo_id = data.documento_tipo;
      this.arrParametrosConsulta.modelo = parametro.modelo;
      this.arrParametrosConsulta.tipo = parametro.tipo;
      this.tipo = parametro.tipo;
      this.modelo = parametro.modelo;
      this.nombreFiltro =
        `${parametro.modulo}_${parametro.modelo}_${parametro.tipo}_filtros`.toLocaleLowerCase();
      this.changeDetectorRef.detectChanges();
      let posicion: keyof typeof Componetes = `${parametro.modelo}`;
      (this.urlEliminar = `${Componetes[posicion].modulo}/${Componetes[
        posicion
      ].modelo?.toLowerCase()}`),
        (this.titulos = mapeo[posicion].datos.filter(
          (titulo: any) => titulo.visibleTabla === true
        ));
      this.consultarLista();
    });
    this.changeDetectorRef.detectChanges();
  }

  consultarLista(): void {
    const filtroGuardado = localStorage.getItem(this.nombreFiltro);

    if (filtroGuardado) {
      this.arrParametrosConsulta.filtros = JSON.parse(filtroGuardado);
    } else if (this.arrParametrosConsulta.filtros.length > 0) {
      this.arrParametrosConsulta.filtros = [];
    }

    let baseUrl = 'general/';
    switch (this.arrParametrosConsulta.tipo) {
      case 'Administrador':
        baseUrl += 'funcionalidad/lista-administrador/';
        break;
      case 'Documento':
        baseUrl += 'documento/lista/';
        this.arrParametrosConsulta = {
          ...this.arrParametrosConsulta,
          ...{
            'documento_tipo_id': this.documento_tipo_id,
          },
        };
        break;
    }
    this.httpService
      .post<{
        cantidad_registros: number;
        registros: any[];
        propiedades: any[];
      }>(baseUrl, this.arrParametrosConsulta)
      .subscribe((respuesta) => {
        this.cantidad_registros = respuesta.cantidad_registros;
        this.arrItems = respuesta.registros;
        this.arrPropiedades = respuesta.propiedades;

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
      if (this.tipo === 'Documento') {
        this.httpService
          .post('general/documento/eliminar/', { documentos: data })
          .subscribe((respuesta: any) => {
            this.alertaService.mensajaExitoso(respuesta.mensaje);
            this.consultarLista();
          });
      } else {
        const eliminarSolicitudes = data.map((registro) => {
          return this.httpService.delete(
            `${this.urlEliminar}/${registro}/`,
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
    } else {
      this.alertaService.mensajeError(
        'Error',
        'No se han seleccionado registros para eliminar'
      );
    }
  }

  descargarExcel() {
    this.httpService
      .descargarArchivo('general/documento/excel/', this.arrParametrosConsulta)
      .subscribe((data) => {
        const blob = new Blob([data], { type: 'application/ms-excel' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.activatedRoute.snapshot.queryParams['modelo']}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
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
