import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { HttpService } from '@comun/services/http.service';
import { TranslationModule } from '@modulos/i18n';
import { TranslateModule } from '@ngx-translate/core';
import { BaseFiltroComponent } from '../../../../../comun/componentes/base-filtro/base-filtro.component';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { documentos } from '@comun/extra/mapeoEntidades/informes';
import { DescargarArchivosService } from '@comun/services/descargarArchivos.service';

@Component({
  selector: 'app-ventas-items',
  standalone: true,
  templateUrl: './ventas-items.component.html',
  imports: [
    CommonModule,
    CardComponent,
    TablaComponent,
    TranslateModule,
    TranslationModule,
    BaseFiltroComponent,
  ],
})
export class VentasItemsComponent extends General implements OnInit {
  arrDocumentos: any = [];
  cantidad_registros!: number;
  arrParametrosConsulta: any = {
    filtros: [],
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
    documento_clase_id: 100,
  };

  constructor(
    private httpService: HttpService,
    private descargarArchivosService: DescargarArchivosService
  ) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.store.dispatch(
        ActualizarMapeo({ dataMapeo: documentos['ventas_items'] })
      );
      this.consultarLista();
    });
    this.changeDetectorRef.detectChanges();
  }

  consultarLista() {
    this.httpService
      .post('general/documento_detalle/informe/', this.arrParametrosConsulta)
      .subscribe((respuesta: any) => {
        this.cantidad_registros = respuesta.length;
        this.arrDocumentos = respuesta.map((documento: any) => ({
          id: documento.id,
          documento_tipo: documento.documento_tipo_nombre,
          fecha: documento.documento_fecha,
          numero: documento.documento_numero,
          item_id: documento.item_id,
          item_nombre: documento.item_nombre,
          cantidad: documento.cantidad,
          precio: documento.precio,
          subtotal: documento.subtotal,
          impuesto: documento.impuesto,
          total: documento.total,
        }));
        this.changeDetectorRef.detectChanges();
      });
  }

  obtenerFiltros(arrFiltrosExtra: any) {
    if (arrFiltrosExtra !== null) {
      this.arrParametrosConsulta.filtros = arrFiltrosExtra;
    }
    this.consultarLista();
  }

  cambiarOrdemiento(ordenamiento: string) {
    (this.arrParametrosConsulta.ordenamientos[0] = ordenamiento),
      this.consultarLista();
  }

  cambiarPaginacion(data: { desplazamiento: number; limite: number }) {
    this.arrParametrosConsulta.limite = data.desplazamiento;
    this.arrParametrosConsulta.desplazar = data.limite;
    this.consultarLista();
  }

  cambiarDesplazamiento(desplazamiento: number) {
    this.arrParametrosConsulta.desplazar = desplazamiento;
    this.consultarLista();
  }

  descargarExcel() {
    this.descargarArchivosService.descargarExcelDocumentoDetalle({
      ...this.arrParametrosConsulta,
      ...{
        limite: 5000,
      },
    });
  }
}
