import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { documentos } from '@comun/extra/mapeo-entidades/informes';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { DocumentoDetalleService } from '@modulos/venta/servicios/documento-detalle.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { FilterCondition } from 'src/app/core/interfaces/filtro.interface';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';
import { FiltroComponent } from '../../../../../comun/componentes/ui/tabla/filtro/filtro.component';
import { VENTAS_ITEM_FILTERS } from '@modulos/venta/domain/mapeos/ventas-item.mapeo';

@Component({
  selector: 'app-ventas-items',
  standalone: true,
  templateUrl: './ventas-items.component.html',
  imports: [
    CommonModule,
    CardComponent,
    TablaComponent,
    TranslateModule,
    FiltroComponent,
  ],
})
export class VentasItemsComponent extends General implements OnInit {
  private readonly _documentoDetalleService = inject(DocumentoDetalleService);
  private readonly _filterTransformerService = inject(FilterTransformerService);

  arrDocumentos: any = [];
  cantidad_registros!: number;
  queryParams: { [key: string]: any } = {
    serializador: 'informe_venta',
  };
  filtros: { [key: string]: any } = {};
  filtrosDisponibles = VENTAS_ITEM_FILTERS;

  constructor(private descargarArchivosService: DescargarArchivosService) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.store.dispatch(
        ActualizarMapeo({ dataMapeo: documentos['ventas_items'] }),
      );
      this.consultarLista();
    });
    this.changeDetectorRef.detectChanges();
  }

  consultarLista(queryParams: { [key: string]: any } = {}) {
    this._documentoDetalleService
      .documentoDetalle({ ...this.queryParams, ...queryParams })
      .subscribe((respuesta) => {
        this.cantidad_registros = respuesta.count;
        this.arrDocumentos = respuesta.results.map((documento: any) => ({
          id: documento.id,
          documento_tipo: documento.documento__documento_tipo__nombre,
          documento_numero: documento.documento__numero,
          documento_fecha: documento.documento__fecha,
          documento_contacto_nombre:
            documento.documento__contacto__nombre_corto,
          item_id: documento.item_id,
          item_nombre: documento.item__nombre,
          cantidad: documento.cantidad,
          precio: documento.precio,
          subtotal: documento.subtotal,
          impuesto: documento.impuesto,
          total: documento.total,
        }));
        this.changeDetectorRef.detectChanges();
      });
  }

  cambiarPaginacion(data: { desplazamiento: number; limite: number }) {
    this.consultarLista({
      ...this.queryParams,
      ...this.filtros,
      page: data.desplazamiento,
    });
  }

  filterChange(filters: FilterCondition[]) {
    const apiParams =
      this._filterTransformerService.transformToApiParams(filters);

    this.filtros = apiParams;
    this.consultarLista({ ...this.queryParams, ...apiParams });
  }

  descargarExcel() {
    this.descargarArchivosService.exportarExcel('general/documento_detalle', {
      ...this.queryParams,
    });
  }
}
