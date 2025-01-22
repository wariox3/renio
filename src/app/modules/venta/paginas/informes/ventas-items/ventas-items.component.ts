import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { HttpService } from '@comun/services/http.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { documentos } from '@comun/extra/mapeo-entidades/informes';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { BaseFiltroComponent } from '@comun/componentes/base-filtro/base-filtro.component';

@Component({
  selector: 'app-ventas-items',
  standalone: true,
  templateUrl: './ventas-items.component.html',
  imports: [
    CommonModule,
    CardComponent,
    TablaComponent,
    TranslateModule,
    BaseFiltroComponent,
],
})
export class VentasItemsComponent extends General implements OnInit {
  arrDocumentos: any = [];
  cantidad_registros!: number;
  filtroPermanente = [
    {
      propiedad: 'documento__documento_tipo__documento_clase__grupo',
      valor1: 1,
    },
  ];
  arrParametrosConsulta: any = {
    filtros: this.filtroPermanente,
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
    documento_clase_id: 100,
    modelo: 'GenDocumentoDetalle',
    serializador: 'Informe',
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
      .post('general/funcionalidad/lista/', this.arrParametrosConsulta)
      .subscribe((respuesta: any) => {
        this.cantidad_registros = respuesta.cantidad_registros;
        this.arrDocumentos = respuesta.registros.map((documento: any) => ({
          id: documento.id,
          documento_tipo: documento.documento_tipo_nombre,
          documento_numero: documento.documento_numero,
          documento_fecha: documento.documento_fecha,
          documento_contacto_nombre: documento.documento_contacto_nombre,
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
      if (arrFiltrosExtra.length >= 1) {
        this.arrParametrosConsulta.filtros = [
          ...this.filtroPermanente,
          ...arrFiltrosExtra,
        ];
      } else {
        this.arrParametrosConsulta.filtros = this.filtroPermanente;
      }
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
    this.descargarArchivosService.descargarExcelDocumentos({
      ...this.arrParametrosConsulta,
      ...{
        limite: 5000,
        excel: true,
      },
    });
  }
}
