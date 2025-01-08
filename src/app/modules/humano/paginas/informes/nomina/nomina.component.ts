import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { BaseFiltroComponent } from '@comun/componentes/base-filtro/base-filtro.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { documentos } from '@comun/extra/mapeo-entidades/informes';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { GeneralService } from '@comun/services/general.service';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';

@Component({
  selector: 'app-nomina',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    TablaComponent,
    TranslateModule,
    BaseFiltroComponent,
  ],
  templateUrl: './nomina.component.html',
})
export class NominaComponent extends General implements OnInit {
  private _descargarArchivosService = inject(DescargarArchivosService);
  arrDocumentos: any = [];
  cantidad_registros!: number;
  filtroPermanente = [
    {
      propiedad: 'documento_tipo__documento_clase_id',
      valor1: 701,
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
    documento_clase_id: 701,
  };
  private readonly _generalService = inject(GeneralService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.store.dispatch(
        ActualizarMapeo({ dataMapeo: documentos['humano_nomina'] })
      );
      this.consultarLista();
    });
    this.changeDetectorRef.detectChanges();
  }

  consultarLista() {
    this._generalService
      .consultarDatosLista<any>(this.arrParametrosConsulta)
      .subscribe((respuesta) => {
        this.cantidad_registros = respuesta.cantidad_registros;
        this.arrDocumentos = respuesta.registros.map((documento: any) => ({
          id: documento.id,
          numero: documento.numero,
          fecha: documento.fecha,
          fecha_hasta: documento.fecha_hasta,
          contacto_id: documento.contacto_id,
          contacto_numero_identificacion:
            documento.contacto_numero_identificacion,
          contacto_nombre_corto: documento.contacto_nombre_corto,
          salario: documento.salario,
          devengado: documento.devengado,
          deduccion: documento.deduccion,
          total: documento.total,
          estado_aprobado: documento.estado_aprobado,
          estado_anulado: documento.estado_anulado,
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
      serializador: 'NominaExcel',
      excel: true,
      filtros: [
        {
          propiedad: 'documento_tipo__documento_clase_id',
          valor1: 701,
        },
      ],
    };

    this._descargarArchivosService.descargarExcelDocumentos(params);
    this.changeDetectorRef.detectChanges();
  }
}
