import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { documentos } from '@comun/extra/mapeo-entidades/documentos';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { GeneralService } from '@comun/services/general.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import {
  ParametrosApi,
  RespuestaApi,
} from 'src/app/core/interfaces/api.interface';
import { FiltroComponent } from '../../../../../../comun/componentes/ui/tabla/filtro/filtro.component';
import { FilterCondition } from 'src/app/core/interfaces/filtro.interface';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';
import { MOVIMIENTO_FILTERS } from '@modulos/contabilidad/domain/mapeos/movimiento.mapeo';

@Component({
  selector: 'app-movimiento-lista',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    TablaComponent,
    TranslateModule,
    FiltroComponent,
  ],
  templateUrl: './movimiento-lista.component.html',
  styleUrl: './movimiento-lista.component.scss',
})
export class MovimientoListaComponent extends General implements OnInit {
  arrDocumentos: any = [];
  cantidad_registros!: number;
  parametrosApiPermanente: ParametrosApi = {
    serializador: 'lista'
  };
  parametrosApi: ParametrosApi = {};
  private _generalService = inject(GeneralService);
  private _filterTransformerService = inject(FilterTransformerService);

  public MOVIMIENTO_FILTERS = MOVIMIENTO_FILTERS;

  constructor(private descargarArchivosService: DescargarArchivosService) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: documentos['ConMovimiento'] }),
    );
    this.consultarLista();
    this.changeDetectorRef.detectChanges();
  }

  consultarLista() {
    this._generalService
      .consultaApi<RespuestaApi<any>>('contabilidad/movimiento/', {
        ...this.parametrosApiPermanente,
        ...this.parametrosApi,
      })
      .subscribe((respuesta) => {
        this.cantidad_registros = respuesta.count;
        this.arrDocumentos = respuesta.results.map((documento) => ({
          id: documento.id,
          fecha: documento.fecha,
          numero: documento.numero,
          contacto_nombre_corto: documento.contacto__nombre_corto,
          comprobante: documento.comprobante__nombre,
          cuenta: documento.cuenta__codigo,
          grupo: documento.grupo__nombre,
          base: documento.base,
          debito: documento.debito,
          credito: documento.credito,
          detalle: documento.detalle,
        }));
        this.changeDetectorRef.detectChanges();
      });
  }

  obtenerFiltros(filtros: FilterCondition[]) {
    const parametros =
      this._filterTransformerService.transformToApiParams(filtros);

    this.parametrosApi = {
      ...parametros,
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
      serializador: 'informe_movimiento',
      excel_informe: 'True',
    };

    this.descargarArchivosService.exportarExcel('contabilidad/movimiento', params);
    this.changeDetectorRef.detectChanges();
  }
}
