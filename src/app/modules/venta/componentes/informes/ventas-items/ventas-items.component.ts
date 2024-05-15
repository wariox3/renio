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
  arrParametrosConsulta: any = {
    filtros: [],
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
    documento_clase_id: 100,
  };

  constructor(private httpService: HttpService) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.store.dispatch(ActualizarMapeo({ dataMapeo: documentos[100] }));
      this.consultarLista();
    });
    this.changeDetectorRef.detectChanges();
  }

  consultarLista() {
    this.httpService
      .post('general/documento_detalle/informe/', this.arrParametrosConsulta)
      .subscribe((respuesta: any) => {
        this.arrDocumentos = respuesta.map((documento: any) => ({
          id: documento.id,
          documento_tipo_nombre: documento.documento_tipo_nombre,
          documento_fecha: documento.documento_fecha,
          documento_numero: documento.documento_numero,
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
}
