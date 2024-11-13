import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { General } from '@comun/clases/general';
import { BaseFiltroComponent } from '@comun/componentes/base-filtro/base-filtro.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ImportarComponent } from '@comun/componentes/importar/importar.component';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { mapeo } from '@comun/extra/mapeoEntidades/administradores';
import { DescargarArchivosService } from '@comun/services/descargarArchivos.service';
import { HttpService } from '@comun/services/http.service';
import { Listafiltros } from '@interfaces/comunes/filtros';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { BehaviorSubject, finalize, forkJoin } from 'rxjs';

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
  visualizarBtnNuevo = true;
  visualizarColumnaEditar = true;
  submodelo: string | undefined;
  cargando$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private httpService: HttpService,
    private descargarArchivosService: DescargarArchivosService
  ) {
    super();
  }

  ngOnInit(): void {
    this.alertaService.cerrarMensajes()
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.visualizarColumnaEditar =
        parametro.visualizarColumnaEditar === 'no' ? false : true;
      this.visualizarBtnNuevo =
        parametro.visualizarBtnNuevo === 'no' ? false : true;
      this.changeDetectorRef.detectChanges();
      this.nombreFiltro = `administrador_${parametro.itemNombre.toLowerCase()}`;
      this.modelo = parametro.itemNombre!;
      let posicion: keyof typeof mapeo = this.modelo;
      this.modulo = mapeo[posicion].modulo;

      this.store.dispatch(
        ActualizarMapeo({ dataMapeo: mapeo[posicion].datos })
      );
      if (parametro.submodelo) {
        this.submodelo = parametro.submodelo!;
        this.arrParametrosConsulta.filtros = [
          {
            operador: '',
            propiedad: 'empleado',
            valor1: true,
          },
        ];
      } else {
        this.submodelo = undefined;

        this.arrParametrosConsulta.filtros = [];
      }
      if (parametro.resoluciontipo) {
        this.arrParametrosConsulta.filtros = [
          {
            operador: '',
            propiedad: parametro.resoluciontipo,
            valor1: true,
          },
        ];
      }
      this.changeDetectorRef.detectChanges();

      this.consultarLista();
    });
    this.changeDetectorRef.detectChanges();
  }

  consultarLista() {
    this.cargando$.next(true);
    this.activatedRoute.queryParams.subscribe((parametro) => {
      let baseUrl = 'general/funcionalidad/lista/';
      let ordenamientoFijo: any[] = parametro?.ordenamiento;
      if (ordenamientoFijo !== undefined) {
        this.arrParametrosConsulta.ordenamientos = [ordenamientoFijo]
      } else {
        this.arrParametrosConsulta.ordenamientos = []
      }
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
        .pipe(finalize(() => this.cargando$.next(false)))
        .subscribe((respuesta: any) => {
          this.cantidad_registros = respuesta.cantidad_registros;
          this.arrItems = respuesta.registros;
          this.arrPropiedades = respuesta.propiedades;

          this.changeDetectorRef.detectChanges();
        });
    })
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
    this.changeDetectorRef.detectChanges();
    this.consultarLista();
  }

  cambiarDesplazamiento(desplazamiento: number) {
    this.arrParametrosConsulta.desplazar = desplazamiento;
    this.consultarLista();
  }

  eliminarRegistros(data: Number[]) {
    if (data.length > 0) {
      let modelo = this.modelo.toLowerCase();
      let eliminarPrefijos = ['hum', 'gen', 'con', 'inv'];
      if (
        eliminarPrefijos.includes(this.modelo.toLowerCase().substring(0, 3))
      ) {
        modelo = this.modelo.toLowerCase().substring(3, this.modelo.length);
      }
      this.cargando$.next(true);
      const eliminarSolicitudes = data.map((id) => {
        return this.httpService.delete(`${this.modulo}/${modelo}/${id}/`, {});
      });
      forkJoin(eliminarSolicitudes)
        .pipe(
          finalize(() => {
            this.cargando$.next(false);
            this.consultarLista();
          })
        )
        .subscribe((respuesta: any) => {
          this.alertaService.mensajaExitoso('Registro eliminado');
          this.confirmacionRegistrosEliminado = true;
          this.changeDetectorRef.detectChanges();
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
}
