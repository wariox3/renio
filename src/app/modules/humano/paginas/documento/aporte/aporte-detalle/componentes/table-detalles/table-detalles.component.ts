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
import { FiltroComponent } from '../../../../../../../../comun/componentes/ui/tabla/filtro/filtro.component';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';
import { FilterCondition } from 'src/app/core/interfaces/filtro.interface';
import { ADICIONAL_DETALLE_FILTERS } from '@modulos/humano/domain/mapeo/adicional.mapeo';

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
    FiltroComponent,
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
  private _filterTransformerService = inject(FilterTransformerService);
  private _generalService = inject(GeneralService);
  private _descargarArchivosService = inject(DescargarArchivosService);
  public filtrosContratos = ADICIONAL_DETALLE_FILTERS;

  @ViewChild('OpcionesDropdown', { static: true }) dropdown!: NgbDropdown;

  constructor() {
    super();
    this.inicializarParametrosConsulta();
  }

  consultarDatos() {
    this._generalService
      .consultaApi<AporteDetalle>('humano/aporte_detalle/', {
        limit: 50,
        aporte_contrato__aporte_id: this.detalle,
      })
      .subscribe((respuesta: any) => {
        this.cantidadRegistros.set(respuesta.count);
        this.arrAporteDetalle.set(
          respuesta.results.map((registro: any) => ({
            ...registro,
            selected: false,
          })),
        );
      });
    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: FiltrosDetalleAporteDetalle }),
    );
  }

  inicializarParametrosConsulta() {
    // this.arrParametrosConsulta.set({
    //   limite: 50,
    //   desplazar: 0,
    //   ordenamientos: [],
    //   limite_conteo: 0,
    //   modelo: 'HumAporteDetalle',
    //   filtros: [
    //     {
    //       propiedad: 'aporte_contrato__aporte_id',
    //       operador: 'exact',
    //       valor1: this.detalle,
    //     },
    //   ],
    // });
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

  filterChange(filters: FilterCondition[]) {
    const apiParams =
      this._filterTransformerService.transformToApiParams(filters);
    this.consultarDatos();
  }
}
