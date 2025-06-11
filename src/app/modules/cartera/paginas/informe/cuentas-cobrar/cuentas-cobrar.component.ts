import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { documentos } from '@comun/extra/mapeo-entidades/informes';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { CUENTAS_COBRAR_FILTERS } from '@modulos/cartera/domain/mapeos/cuentas-cobrar.mapeo';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { FilterCondition } from 'src/app/core/interfaces/filtro.interface';
import { DocumentoService } from 'src/app/core/services/documento.service';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';
import { FiltroComponent } from '../../../../../comun/componentes/ui/tabla/filtro/filtro.component';

@Component({
  selector: 'app-cuentas-cobrar',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    TablaComponent,
    TranslateModule,
    FiltroComponent,
  ],
  templateUrl: './cuentas-cobrar.component.html',
})
export class CuentasCobrarComponent extends General implements OnInit {
  arrDocumentos: any = [];
  cantidad_registros!: number;
  filtros: { [key: string]: any } = {};
  queryParams: { [key: string]: any } = {
    serializador: 'informe',
    documento_tipo__cobrar: true,
    estado_aprobado: true,
    pendiente__gt: 0,
  };
  filtrosDisponibles = CUENTAS_COBRAR_FILTERS;

  private _documentoService = inject(DocumentoService);
  private _filterTransformerService = inject(FilterTransformerService);

  constructor(private descargarArchivosService: DescargarArchivosService) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.store.dispatch(
        ActualizarMapeo({ dataMapeo: documentos['cuentas_cobrar'] }),
      );
      this.consultarLista();
    });
    this.changeDetectorRef.detectChanges();
  }

  consultarLista(queryParams: { [key: string]: any } = {}) {
    this._documentoService
      .getDocumento({ ...this.queryParams, ...queryParams })
      .subscribe((respuesta: any) => {
        this.cantidad_registros = respuesta.count;
        this.arrDocumentos = respuesta.results.map((documento: any) => ({
          id: documento.id,
          numero: documento.numero,
          fecha: documento.fecha,
          fecha_vence: documento.fecha_vence,
          documento_tipo_id: documento.documento_tipo_id,
          documento_tipo_nombre: documento.documento_tipo__nombre,
          contacto_nombre_corto: documento.contacto__nombre_corto,
          subtotal: documento.subtotal,
          impuesto: documento.impuesto,
          total: documento.total,
          afectado: documento.afectado,
          pendiente: documento.pendiente,
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
    this.descargarArchivosService.exportarExcel('general/documento', {
      ...this.queryParams,
      ...this.filtros,
    });
  }
}
