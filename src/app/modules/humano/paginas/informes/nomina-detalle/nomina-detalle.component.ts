import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { documentos } from '@comun/extra/mapeo-entidades/informes';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { GeneralService } from '@comun/services/general.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import {
  ParametrosApi,
  RespuestaApi,
} from 'src/app/core/interfaces/api.interface';
import { FiltroComponent } from '@comun/componentes/ui/tabla/filtro/filtro.component';
import { NOMINA_DETALLE_INFORME_FILTERS } from '@modulos/humano/domain/mapeo/nomina-detalle-informe.mapeo';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';
import { FilterCondition } from 'src/app/core/interfaces/filtro.interface';
import { NominaDetalleInforme } from '@modulos/humano/interfaces/nomina-detalle-informe.interface';

@Component({
  selector: 'app-nomina-detalle',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    TablaComponent,
    TranslateModule,
    FiltroComponent,
  ],
  templateUrl: './nomina-detalle.component.html',
})
export class NominaDetalleComponent extends General implements OnInit {
  private _descargarArchivosService = inject(DescargarArchivosService);
  private readonly _generalService = inject(GeneralService);
  private _filterTransformService = inject(FilterTransformerService);

  CAMPOS_FILTRO = NOMINA_DETALLE_INFORME_FILTERS;
  arrDocumentos: NominaDetalleInforme[] = [];
  cantidadRegistros = signal<number>(0);
  parametrosApiPermanente: ParametrosApi = {
    documento__documento_tipo__documento_clase_id: 701,
    serializador: 'nomina',
    limit: 50,
  };
  parametrosApi: ParametrosApi = {
    ...this.parametrosApiPermanente,
  };

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: documentos['humano_nomina_detalle'] }),
    );
    this.consultarLista();
  }

  consultarLista() {
    this._generalService
      .consultaApi<
        RespuestaApi<NominaDetalleInforme>
      >('general/documento_detalle/', this.parametrosApi)
      .subscribe((respuesta) => {
        this.cantidadRegistros.set(respuesta.count);
        this.arrDocumentos = respuesta.results;
        this.changeDetectorRef.detectChanges();
      });
  }

  obtenerFiltros(filtros: FilterCondition[]) {
    const apiParams =
      this._filterTransformService.transformToApiParams(filtros);

    this.parametrosApi = {
      ...this.parametrosApiPermanente,
      ...apiParams,
    };

    this.consultarLista();
  }

  cambiarPaginacion(data: { desplazamiento: number; limite: number }) {
    this.parametrosApi = {
      ...this.parametrosApi,
      page: data.desplazamiento,
    };

    this.consultarLista();
  }

  descargarExcel() {
    const params: ParametrosApi = {
      ...this.parametrosApi,
      serializador: 'informe_nomina_detalle',
      excel_informe: 'True',
    };

    this._descargarArchivosService.exportarExcel(
      'general/documento_detalle',
      params,
    );
    this.changeDetectorRef.detectChanges();
  }
}
