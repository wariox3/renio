import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { BaseFiltroComponent } from '@comun/componentes/base-filtro/base-filtro.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { documentos } from '@comun/extra/mapeoEntidades/informes';
import { DescargarArchivosService } from '@comun/services/descargarArchivos.service';
import { HttpService } from '@comun/services/http.service';
import { AutocompletarRegistros } from '@interfaces/comunes/autocompletar';
import { NominaDetalle } from '@interfaces/humano/informe.interface';
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
  templateUrl: './nomina-detalle.component.html'
})
export class NominaDetalleComponent extends General  implements OnInit {
  arrDocumentos: any = [];
  cantidad_registros!: number;
  filtroPermanente = [
    {
      "propiedad":"documento__documento_tipo__documento_clase_id",
      "valor1": 701
    }
  ];
  arrParametrosConsulta: any = {
    modelo: 'GenDocumentoDetalle',
    serializador: 'Nomina',
    filtros: this.filtroPermanente,
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
  };

  constructor(
    private httpService: HttpService,
    private descargarArchivosService: DescargarArchivosService
  ) {
   super();
  }
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(() => {
      this.store.dispatch(
        ActualizarMapeo({ dataMapeo: documentos['humano_nomina_detalle'] })
      );
      this.consultarLista();
    });
    this.changeDetectorRef.detectChanges();
  }

  consultarLista() {
    this.httpService
      .post<AutocompletarRegistros<NominaDetalle>>('general/funcionalidad/lista/', this.arrParametrosConsulta)
      .subscribe((respuesta) => {
        this.cantidad_registros = respuesta.registros?.length;
        this.arrDocumentos = respuesta.registros?.map((documento) => ({
          id: documento.id,
          documento_id: documento.documento_id,
          documento_tipo_nombre: documento.documento_tipo_nombre,
          documento_fecha: documento.documento_fecha,
          documento_numero: documento.documento_numero,
          documento_contacto_nombre: documento.documento_contacto_nombre,
          concepto_id: documento.concepto_id,
          concepto_nombre: documento.concepto_nombre,
          detalle: documento.detalle,
          porcentaje: documento.porcentaje,
          cantidad: documento.cantidad,
          dias: documento.dias,
          hora: documento.hora,
          operacion: documento.operacion,
          pago: documento.pago,
          pago_operado: documento.pago_operado,
          devengado: documento.devengado,
          deduccion: documento.deduccion,
          base_cotizacion: documento.base_cotizacion,
          base_prestacion: documento.base_prestacion,
          base_impuesto: documento.base_impuesto
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
    this.descargarArchivosService.descargarExcelDocumentoDetalle({
      ...this.arrParametrosConsulta,
      ...{
        limite: 5000,
      },
    });
  }
}
