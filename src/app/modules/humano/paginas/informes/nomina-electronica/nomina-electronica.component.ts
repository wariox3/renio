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
import { NominaElectronica } from '@modulos/humano/interfaces/nomina-electronica.interface.';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';

@Component({
  selector: 'app-nomina-electronica',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    TablaComponent,
    TranslateModule,
    BaseFiltroComponent,
  ],
  templateUrl: './nomina-electronica.component.html',
  styleUrl: './nomina-electronica.component.scss',
})
export class NominaElectronicaComponent extends General implements OnInit {
  private _descargarArchivosService = inject(DescargarArchivosService);
  arrDocumentos: any = [];
  cantidad_registros!: number;

  filtroPermanente: Filtros[] = [
    {
      propiedad: 'documento_tipo__documento_clase_id',
      valor1: 702,
    },
  ];
  arrParametrosConsulta: ParametrosFiltros = {
    modelo: 'GenDocumento',
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
        ActualizarMapeo({ dataMapeo: documentos['humano_nomina_electronica'] }),
      );
      this.consultarLista();
    });
    this.changeDetectorRef.detectChanges();
  }

  consultarLista() {
    this._generalService
      .consultarDatosAutoCompletar<NominaElectronica>(
        this.arrParametrosConsulta,
      )
      .subscribe((respuesta) => {
        this.cantidad_registros = respuesta.cantidad_registros;
        this.arrDocumentos = respuesta.registros?.map((documento) => ({
          id: documento.id,
          numero: documento.numero,
          fecha: documento.fecha,
          fecha_hasta: documento.fecha_hasta,
          contacto_id: documento.contacto_id,
          contacto_numero_identificacion:
            documento.contacto_numero_identificacion,
          contacto_nombre_corto: documento.contacto_nombre_corto,
          contrato_id: documento.contrato_id || 0,
          salario: documento.salario,
          base_cotizacion: documento.base_cotizacion || 0,
          base_prestacion: documento.base_prestacion || 0,
          devengado: documento.devengado,
          deduccion: documento.deduccion,
          total: documento.total,
          estado_aprobado: documento.estado_aprobado,
          estado_anulado: documento.estado_anulado,
          estado_electronico: documento.estado_electronico,
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
      modelo: 'GenDocumento',
      limite: this.cantidad_registros,
      serializador: 'Nomina',
      excel: true,
      filtros: [...this.arrParametrosConsulta.filtros],
    };

    this._descargarArchivosService.descargarExcelDocumentos(params);
    this.changeDetectorRef.detectChanges();
  }
}
