import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { documentos } from '@comun/extra/mapeo-entidades/informes';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { CUENTA_PAGAR_FILTERS } from '@modulos/tesoreria/domain/mapeos/cartera.mapeo';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { FilterCondition } from 'src/app/core/interfaces/filtro.interface';
import { DocumentoService } from 'src/app/core/services/documento.service';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';
import { FiltroComponent } from '../../../../../comun/componentes/ui/tabla/filtro/filtro.component';

@Component({
  selector: 'app-cuentas-pagar',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    TablaComponent,
    TranslateModule,
    FiltroComponent,
  ],
  templateUrl: './cuentas-pagar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuentasPagarComponent extends General implements OnInit {
  arrDocumentos: any = [];
  cantidad_registros!: number;
  filtros: { [key: string]: any } = {};
  queryParams: { [key: string]: any } = {
    serializador: 'informe_cuenta_pagar',
    documento_tipo__pagar: true,
    estado_aprobado: true,
    pendiente__gt: 0,
  };
  filtrosDisponibles = CUENTA_PAGAR_FILTERS;

  private readonly _documentoService = inject(DocumentoService);
  private readonly descargarArchivosService = inject(DescargarArchivosService);
  private readonly _filterTransformerService = inject(FilterTransformerService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.store.dispatch(
        ActualizarMapeo({ dataMapeo: documentos['cuentas_pagar'] }),
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
          documento_tipo_nombre: documento.documento_tipo__nombre,
          numero: documento.numero,
          fecha: documento.fecha,
          fecha_vence: documento.fecha_vence,
          fecha_contable: documento.fecha_contable,
          contacto: documento.contacto__nombre_corto,
          contacto_numero_identificacion:
            documento.contacto__numero_identificacion,
          subtotal: documento.subtotal,
          base_impuesto: documento.base_impuesto,
          impuesto: documento.impuesto,
          descuento: documento.descuento,
          total: documento.total,
          afectado: documento.afectado,
          estado_anulado: documento.estado_anulado,
          estado_aprobado: documento.estado_aprobado,
          estado_electronico: documento.estado_electronico,
          estado_electronico_enviado: documento.estado_electronico_enviado,
          estado_electronico_notificado:
            documento.estado_electronico_notificado,
          pendiente: documento.pendiente,
          documento_tipo: documento.documento_tipo,
          metodo_pago: documento.metodo_pago,
          contacto_id: documento.contacto_id,
          contacto_nombre_corto: documento.contacto__nombre_corto,
          soporte: documento.soporte,
          orden_compra: documento.orden_compra,
          cue: documento.cue,
          empresa: documento,
          resolucion: documento,
          documento_referencia: documento,
          plazo_pago: documento.plazo_pago,
          comentario: documento.comentario,
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
      excel_informe: 'True'
    });
  }
}
