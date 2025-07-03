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
  filtroPermanente = [];
  private _generalService = inject(GeneralService);
  private _filterTransformerService = inject(FilterTransformerService);

  public MOVIMIENTO_FILTERS = MOVIMIENTO_FILTERS;

  constructor(private descargarArchivosService: DescargarArchivosService) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.store.dispatch(
        ActualizarMapeo({ dataMapeo: documentos['ConMovimiento'] }),
      );
      this.consultarLista();
    });
    this.changeDetectorRef.detectChanges();
  }

  consultarLista(parametros?: ParametrosApi) {
    this._generalService
      .consultaApi<RespuestaApi<any>>('contabilidad/movimiento/', parametros)
      .subscribe((respuesta) => {
        this.cantidad_registros = respuesta.count;
        this.arrDocumentos = respuesta.results.map((documento) => ({
          id: documento.id,
          fecha: documento.fecha,
          numero: documento.numero,
          contacto_nombre_corto: documento.contacto_nombre_corto,
          comprobante: documento.comprobante_nombre,
          cuenta: documento.cuenta_codigo,
          grupo: documento.grupo_nombre,
          base: documento.base,
          debito: documento.debito,
          credito: documento.credito,
        }));
        this.changeDetectorRef.detectChanges();
      });
  }

  obtenerFiltros(filtros: FilterCondition[]) {
    const parametros =
      this._filterTransformerService.transformToApiParams(filtros);

    this.consultarLista(parametros);
  }

  cambiarPaginacion(data: { desplazamiento: number; limite: number }) {
    this.consultarLista({
      page: data.desplazamiento,
    });
  }

  descargarExcel() {
    this.descargarArchivosService.descargarExcelDocumentos({
      filtros: [],
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'ConMovimiento',
      limite: this.cantidad_registros,
      excel: true,
    });
  }
}
