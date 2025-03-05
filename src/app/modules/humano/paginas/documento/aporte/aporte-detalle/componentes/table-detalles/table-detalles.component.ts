import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { General } from '@comun/clases/general';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { GeneralService } from '@comun/services/general.service';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { AporteDetalle } from '@modulos/humano/interfaces/aporte-detalle.interface';
import { RespuestaAporteDetalle } from '@modulos/humano/interfaces/respuesta-aporte-detalle';
import {
  NgbDropdown,
  NgbDropdownModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SiNoPipe } from '@pipe/si-no.pipe';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { PaginadorComponent } from '../../../../../../../../comun/componentes/paginador/paginador.component';
import { FiltrosDetalleAporteDetalle } from '../../constantes';
import { BaseFiltroComponent } from '../../../../../../../../comun/componentes/base-filtro/base-filtro.component';

@Component({
  selector: 'app-table-detalles',
  standalone: true,
  imports: [
    PaginadorComponent,
    TranslateModule,
    NgbDropdownModule,
    CommonModule,
    SiNoPipe,
    NgbTooltipModule,
    BaseFiltroComponent,
  ],
  templateUrl: './table-detalles.component.html',
})
export class TableDetallesComponent extends General {
  cantidadRegistros = signal(0);
  ordenadoTabla = signal('');
  cargandoContratos = signal(false);
  arrParametrosConsulta = signal<ParametrosFiltros>({
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 0,
    modelo: 'HumAporteDetalle',
    filtros: [],
  });
  arrAporteDetalle = signal<RespuestaAporteDetalle[]>([]);

  private _generalService = inject(GeneralService);
  private _descargarArchivosService = inject(DescargarArchivosService);

  @ViewChild('OpcionesDropdown', { static: true }) dropdown!: NgbDropdown;

  constructor() {
    super();
    this.inicializarParametrosConsulta();
  }

  consultarDatos() {
    this._generalService
      .consultarDatosLista<AporteDetalle>(this.arrParametrosConsulta())
      .subscribe((respuesta) => {
        this.cantidadRegistros.set(respuesta.cantidad_registros);
        this.arrAporteDetalle.set(
          respuesta.registros.map((registro: any) => ({
            ...registro,
            selected: false,
          })),
        );
        this.changeDetectorRef.detectChanges();
      });
    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: FiltrosDetalleAporteDetalle }),
    );
  }

  inicializarParametrosConsulta() {
    this.arrParametrosConsulta.set({
      limite: 50,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 0,
      modelo: 'HumAporteDetalle',
      filtros: [
        {
          propiedad: 'aporte_contrato__aporte_id',
          operador: 'exact',
          valor1: this.detalle,
        },
      ],
    });
  }

  obtenerFiltros(data: any[]) {
    this.inicializarParametrosConsulta();
    if (data.length > 0) {
      this.arrParametrosConsulta.update((parametros) => ({
        ...parametros,
        filtros: [...parametros.filtros, ...data],
      }));
    } else {
      this.inicializarParametrosConsulta();
    }
    this.consultarDatos();
  }

  cambiarDesplazamiento(desplazamiento: number) {
    this.arrParametrosConsulta.update((arrParametrosConsulta) => ({
      ...arrParametrosConsulta,
      desplazar: desplazamiento,
    }));
    this.consultarDatos();
  }

  cambiarPaginacion(data: { desplazamiento: number; limite: number }) {
    this.arrParametrosConsulta.update((arrParametrosConsulta) => ({
      ...arrParametrosConsulta,
      limite: data.desplazamiento,
      desplazar: data.limite,
    }));
    this.consultarDatos();
  }

  descargarExcelDetalle() {
    const modelo = 'HumAporteDetalle';
    const params = {
      modelo,
      serializador: 'Excel',
      excel: true,
      limite: 10000,
      filtros: [...this.arrParametrosConsulta().filtros],
    };

    this._descargarArchivosService.descargarExcelAdminsitrador(modelo, params);
    this.dropdown.close();
  }
}
