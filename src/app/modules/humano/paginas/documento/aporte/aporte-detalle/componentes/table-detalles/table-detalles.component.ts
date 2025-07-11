import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { General } from '@comun/clases/general';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { GeneralService } from '@comun/services/general.service';
import { APORTE_DETALLE_FILTERS } from '@modulos/humano/domain/mapeo/seguridad-social.mapeo';
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
import { ParametrosApi } from 'src/app/core/interfaces/api.interface';
import { FilterCondition } from 'src/app/core/interfaces/filtro.interface';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';
import { FiltroComponent } from '../../../../../../../../comun/componentes/ui/tabla/filtro/filtro.component';
import { FiltrosDetalleAporteDetalle } from '../../constantes';
import { PaginadorComponent } from "@comun/componentes/ui/tabla/paginador/paginador.component";

@Component({
  selector: 'app-table-detalles',
  standalone: true,
  imports: [
    TranslateModule,
    NgbDropdownModule,
    CommonModule,
    SiNoPipe,
    NgbTooltipModule,
    FiltroComponent,
    PaginadorComponent
],
  templateUrl: './table-detalles.component.html',
})
export class TableDetallesComponent extends General {
  cantidadRegistros = signal(0);
  ordenadoTabla = signal('');
  cargandoContratos = signal(false);
  parametrosApi = signal<ParametrosApi>({
  });
  parametrosApiPermanentes = signal<ParametrosApi>({
    limit: 50,
    aporte_contrato__aporte_id: this.detalle,
  });
  arrAporteDetalle = signal<RespuestaAporteDetalle[]>([]);
  private _filterTransformerService = inject(FilterTransformerService);
  private _generalService = inject(GeneralService);
  private _descargarArchivosService = inject(DescargarArchivosService);
  public filtrosContratos = APORTE_DETALLE_FILTERS;

  @ViewChild('OpcionesDropdown', { static: true }) dropdown!: NgbDropdown;

  constructor() {
    super();
    this.inicializarParametrosConsulta();
  }

  consultarDatos() {
    this._generalService
      .consultaApi<AporteDetalle>('humano/aporte_detalle/', {
        ...this.parametrosApiPermanentes(),
        ...this.parametrosApi(),
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
   this.parametrosApi.set({
    ...this.parametrosApiPermanentes(),
   });
  }


  cambiarPaginacion(page: number) {
    this.parametrosApi.update((arrParametrosConsulta) => ({
      ...arrParametrosConsulta,
      page,
    }));
    
    this.consultarDatos();
  }

  descargarExcelDetalle() {
    const params = {
      ...this.parametrosApi(),
      serializador: 'informe_aporte_detalle',
      excel_informe: 'True',
    };

    this._descargarArchivosService.exportarExcel('humano/aporte_detalle', params);
    this.dropdown.close();
  }

  filterChange(filters: FilterCondition[]) {
    const apiParams =
      this._filterTransformerService.transformToApiParams(filters);
    
    this.parametrosApi.update(() => ({
      ...this.parametrosApiPermanentes(),
      ...apiParams,
    }));
    
      this.consultarDatos();
  }
}
