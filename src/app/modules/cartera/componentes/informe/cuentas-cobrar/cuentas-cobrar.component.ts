import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { BaseFiltroComponent } from '@comun/componentes/base-filtro/base-filtro.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { documentos } from '@comun/extra/mapeoEntidades/informes';
import { DescargarArchivosService } from '@comun/services/descargarArchivos.service';
import { HttpService } from '@comun/services/http.service';

import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';

@Component({
  selector: 'app-cuentas-cobrar',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    TablaComponent,
    TranslateModule,
    BaseFiltroComponent,
],
  templateUrl: './cuentas-cobrar.component.html',
})
export class CuentasCobrarComponent extends General implements OnInit {
  arrDocumentos: any = [];
  cantidad_registros!: number;
  filtroPermanente = [
    { propiedad: 'documento_tipo__documento_clase__grupo', valor1: 1 },
    { propiedad: 'pendiente__gt', valor1: 0 },
  ];
  arrParametrosConsulta: any = {
    filtros: this.filtroPermanente,
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
    modelo: 'GenDocumento',
    serializador: "Informe"
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
        ActualizarMapeo({ dataMapeo: documentos['cuentas_cobrar'] })
      );
      this.consultarLista();
    });
    this.changeDetectorRef.detectChanges();
  }

  consultarLista() {
    this.httpService
      .post('general/funcionalidad/lista/', this.arrParametrosConsulta)
      .subscribe((respuesta: any) => {
        this.cantidad_registros = respuesta.length;
        this.arrDocumentos = respuesta.registros.map((documento: any) => ({
          id: documento.id,
          numero: documento.numero,
          fecha: documento.fecha,
          fecha_vence: documento.fecha_vence,
          fecha_contable: documento.fecha_contable,
          contacto: documento.contacto_nombre_corto,
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
          contacto_nombre_corto: documento.contacto_nombre_corto,
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
      },
    });
  }
}
