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
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';
import { FilterCondition } from 'src/app/core/interfaces/filtro.interface';
import { NominaInforme } from '@modulos/compra/interfaces/nomina-informe.interface';
import { NOMINA_INFORME_FILTERS } from '@modulos/humano/domain/mapeo/nomina-informe.mapeo';

@Component({
  selector: 'app-nomina',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    TablaComponent,
    TranslateModule,
    FiltroComponent,
  ],
  templateUrl: './nomina.component.html',
})
export class NominaComponent extends General implements OnInit {
  private _filterTransformService = inject(FilterTransformerService);
  private _descargarArchivosService = inject(DescargarArchivosService);
  public CAMPOS_FILTRO = NOMINA_INFORME_FILTERS;
  arrDocumentos: any = [];
  cantidadRegistros = signal<number>(0);
  parametrosApiPermanente: ParametrosApi = {
    documento_tipo__documento_clase_id: 701,
    serializador: 'nomina',
    limit: 50,
  };

  parametrosApi: ParametrosApi = {
    ...this.parametrosApiPermanente,
  };

  private readonly _generalService = inject(GeneralService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: documentos['humano_nomina'] }),
    );
    this.consultarLista();
    this.changeDetectorRef.detectChanges();
  }

  consultarLista() {
    this._generalService
      .consultaApi<
        RespuestaApi<NominaInforme>
      >('general/documento/', this.parametrosApi)
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
      serializador: 'informe_nomina',
      excel_informe: 'True',
      documento_tipo__documento_clase_id: 701,
    };

    this._descargarArchivosService.exportarExcel('general/documento', params);
    this.changeDetectorRef.detectChanges();
  }
}
