import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { documentos } from '@comun/extra/mapeo-entidades/informes';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { GeneralService } from '@comun/services/general.service';
import { NominaElectronica } from '@modulos/humano/interfaces/nomina-electronica.interface.';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import {
  ParametrosApi,
  RespuestaApi,
} from 'src/app/core/interfaces/api.interface';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';
import { FiltroComponent } from '@comun/componentes/ui/tabla/filtro/filtro.component';
import { NOMINA_ELECTRONICA_INFORME_FILTERS } from '@modulos/humano/domain/mapeo/nomina-electronica-informe.mapeo';
import { FilterCondition } from 'src/app/core/interfaces/filtro.interface';

@Component({
  selector: 'app-nomina-electronica',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    TablaComponent,
    TranslateModule,
    FiltroComponent,
  ],
  templateUrl: './nomina-electronica.component.html',
  styleUrl: './nomina-electronica.component.scss',
})
export class NominaElectronicaComponent extends General implements OnInit {
  private _descargarArchivosService = inject(DescargarArchivosService);
  private _filterTransformService = inject(FilterTransformerService);
  public CAMPOS_FILTRO = NOMINA_ELECTRONICA_INFORME_FILTERS;
  arrDocumentos: NominaElectronica[] = [];
  cantidadRegistros = signal<number>(0);

  parametrosApiPermanente: ParametrosApi = {
    documento_tipo__documento_clase_id: 702,
    limit: 50,
    serializador: 'nomina',
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
      ActualizarMapeo({ dataMapeo: documentos['humano_nomina_electronica'] }),
    );
    this.consultarLista();
  }

  consultarLista() {
    this._generalService
      .consultaApi<
        RespuestaApi<NominaElectronica>
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
      ...this.parametrosApi,
      serializador: 'informe_nomina_electronica',
      excel_informe: 'True',
    };

    this._descargarArchivosService.exportarExcel('general/documento', params);
    this.changeDetectorRef.detectChanges();
  }
}
