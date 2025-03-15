import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { BaseFiltroComponent } from '@comun/componentes/base-filtro/base-filtro.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { documentos } from '@comun/extra/mapeo-entidades/informes';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { GeneralService } from '@comun/services/general.service';
import { Filtros } from '@interfaces/comunes/componentes/filtros/filtros.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';

@Component({
  selector: 'app-nomina-detalle',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    TablaComponent,
    TranslateModule,
    BaseFiltroComponent,
  ],
  templateUrl: './nomina-detalle.component.html',
})
export class NominaDetalleComponent extends General implements OnInit {
  private _descargarArchivosService = inject(DescargarArchivosService);
  arrDocumentos: any = [];
  cantidad_registros!: number;
  filtroPermanente: Filtros[] = [
    {
      propiedad: 'documento__documento_tipo__documento_clase_id',
      valor1: 701,
    },
  ];
  arrParametrosConsulta: ParametrosFiltros = {
    modelo: 'GenDocumentoDetalle',
    serializador: 'Nomina',
    filtros: this.filtroPermanente,
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
  };
  private readonly _generalService = inject(GeneralService);

  constructor() {
    super();
  }
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(() => {
      this.store.dispatch(
        ActualizarMapeo({ dataMapeo: documentos['humano_nomina_detalle'] }),
      );
      this.consultarLista();
    });
    this.changeDetectorRef.detectChanges();
  }

  consultarLista() {
    this._generalService
      .consultarDatosLista(this.arrParametrosConsulta)
      .subscribe((respuesta: any) => {
        this.cantidad_registros = respuesta.cantidad_registros;
        this.arrDocumentos = respuesta.registros?.map((documento: any) => ({
          id: documento.id,
          documento_id: documento.documento_id,
          documento_contacto_id: documento.documento_contacto_id,
          documento_contacto_numero_identificacion:
            documento.documento_contacto_numero_identificacion,
          documento_contacto_nombre_corto: documento.documento_contacto_nombre,
          documento_fecha: documento.documento_fecha,
          documento_fecha_hasta: documento.documento_fecha_hasta,
          detalle: documento.detalle,
          porcentaje: documento.porcentaje,
          dias: documento.dias,
          hora: documento.hora,
          operacion: documento.operacion,
          pago: documento.pago,
          base_cotizacion: documento.base_cotizacion,
          base_prestacion: documento.base_prestacion,
          base_impuesto: documento.base_impuesto,
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
    const params = {
      modelo: 'GenDocumentoDetalle',
      limite: this.cantidad_registros,
      serializador: 'NominaExcel',
      excel: true,
      filtros: [...this.arrParametrosConsulta.filtros],
    };

    this._descargarArchivosService.descargarExcelDocumentos(params);
    this.changeDetectorRef.detectChanges();
  }
}
