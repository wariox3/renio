import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { Listafiltros } from '@interfaces/comunes/filtros';
import { combineLatest } from 'rxjs';
import { mapeo } from '@comun/extra/mapeoEntidades/administradores';
import { CardComponent } from '@comun/componentes/card/card.component';
import { BaseFiltroComponent } from '@comun/componentes/base-filtro/base-filtro.component';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { ImportarComponent } from '@comun/componentes/importar/importar.component';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { DescargarArchivosService } from '@comun/services/descargarArchivos.service';

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

  constructor(
    private httpService: HttpService,
    private descargarArchivosService: DescargarArchivosService
  ) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.nombreFiltro = `administrador_${localStorage
        .getItem('itemNombre')
        ?.toLowerCase()}`;
      this.modelo = localStorage.getItem('itemNombre')!;
      let posicion: keyof typeof mapeo = this.modelo;
      this.modulo = mapeo[posicion].modulo;
      this.store.dispatch(
        ActualizarMapeo({ dataMapeo: mapeo[posicion].datos })
      );
      if (parametro.parametro) {
        this.arrParametrosConsulta.filtros = [
          {
            propiedad: parametro.parametro,
            valor1: true,
          },
        ];
      } else {
        this.arrParametrosConsulta.filtros = [];
      }
      this.consultarLista();
    });
    this.changeDetectorRef.detectChanges();
  }

  consultarLista() {
    let baseUrl = 'general/funcionalidad/lista-administrador/';
    this.arrParametrosConsulta = {
      ...this.arrParametrosConsulta,
      ...{
        modelo: this.modelo,
      },
    };

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

  obtenerFiltros(arrfiltros: any[]) {
    if (arrfiltros.length >= 1) {
      this.arrParametrosConsulta.filtros = arrfiltros;
      this.changeDetectorRef.detectChanges();
    } else {
      this.arrParametrosConsulta.filtros = [];
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
      let modelo = this.modelo.toLowerCase()
      let eliminarPrefijos = ['hum']
      if(eliminarPrefijos.includes(this.modelo.toLowerCase().substring(0, 3))){
        modelo = this.modelo.toLowerCase().substring(3, this.modelo.length)
      }
      const eliminarSolicitudes = data.map((id) => {
        return this.httpService.delete(
          `${this.modulo}/${modelo}/${id}/`,
          {}
        );
      });
      combineLatest(eliminarSolicitudes).subscribe((respuesta: any) => {
        this.alertaService.mensajaExitoso('Registro eliminado');
        this.confirmacionRegistrosEliminado = true;
        this.changeDetectorRef.detectChanges();
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
    this.activatedRoute.queryParams.subscribe((parametros) => {
      this.router.navigate([`/administrador/nuevo`], {
        queryParams: {
          ...parametros,
        },
      });
    });
  }

  navegarEditar(id: number) {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.router.navigate([`/administrador/editar`], {
        queryParams: {
          ...parametro,
          detalle: id,
        },
      });
    });
  }

  navegarDetalle(id: number) {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.router.navigate([`/administrador/detalle`], {
        queryParams: {
          ...parametro,
          detalle: id,
        },
      });
    });
  }

  descargarExcel() {
    let modelo = localStorage.getItem('itemTipo')!;
    this.descargarArchivosService.descargarExcelAdminsitrador(modelo, {
      ...this.arrParametrosConsulta,
      ...{
        limite: 5000,
      },
    });
  }

}
