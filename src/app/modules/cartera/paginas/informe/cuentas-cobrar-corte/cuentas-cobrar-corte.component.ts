import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { documentos } from '@comun/extra/mapeo-entidades/informes';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { FechasService } from '@comun/services/fechas.service';
import { GeneralService } from '@comun/services/general.service';
import { CUENTAS_COBRAR_CORTE_FILTERS } from '@modulos/cartera/domain/mapeos/cuentas-cobrar-corte.mapeo';
import { CuentasCobrarCorte } from '@modulos/cartera/interfaces/cuentas-cobrar-corte.interface';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { ParametrosApi } from 'src/app/core/interfaces/api.interface';
import { FilterCondition } from 'src/app/core/interfaces/filtro.interface';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';
import { FiltroComponent } from "../../../../../comun/componentes/ui/tabla/filtro/filtro.component";

@Component({
  selector: 'app-cuentas-cobrar-corte',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    TablaComponent,
    TranslateModule,
    FiltroComponent
],
  templateUrl: './cuentas-cobrar-corte.component.html',
})
export class CuentasCobrarCorteComponent extends General implements OnInit {
  private _filterTransformerService = inject(FilterTransformerService);
  private _fechaService = inject(FechasService);
  private _generalService = inject(GeneralService);
  CAMPOS_FILTRO = CUENTAS_COBRAR_CORTE_FILTERS;
  filtros: ParametrosApi = {};
  arrDocumentos: CuentasCobrarCorte[] = [];
  cantidad_registros!: number;
  queryParams: ParametrosApi = {
    limit: 50,
    serializador: 'Informe',
  };

  public filtroKey = 'cartera_cuentascobrarcorte';

  constructor(private descargarArchivosService: DescargarArchivosService) {
    super();
  }

  ngOnInit(): void {
    this._cargarFiltrosPredeterminados();
    this._construirFiltros();
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.store.dispatch(
        ActualizarMapeo({ dataMapeo: documentos['cuentas_cobrar_corte'] }),
      );
      this.consultarLista();
    });
    this.changeDetectorRef.detectChanges();
  }

  private _cargarFiltrosPredeterminados() {
    const currentDate = this._fechaService.obtenerFechaActualFormateada();
    this.queryParams = {
      ...this.queryParams,
      fecha: currentDate,
    };

    const filtroValue = [
      {
        propiedad: 'fecha',
        operadorFiltro: 'exact',
        valor1: currentDate,
        tipo: 'DateField',
        operador: 'exact',
        campo: 'fecha',
      },
    ];

    localStorage.setItem(this.filtroKey, JSON.stringify(filtroValue));
  }

  consultarLista(queryParams: ParametrosApi = {}) {
    this._generalService
      .consultaApi<{ registros: CuentasCobrarCorte[], cantidad_registros: number }>(
        'cartera/informe/pendiente-corte/',
        this.queryParams)
      .subscribe((respuesta) => {
        this.cantidad_registros = respuesta.cantidad_registros;
        this.arrDocumentos = respuesta.registros.map((documento) => ({
          id: documento.id,
          abono: documento.abono,
          numero: documento.numero,
          fecha: documento.fecha,
          fecha_vence: documento.fecha_vence,
          documento_tipo_id: documento.documento_tipo_id,
          documento_tipo_nombre: documento.documento_tipo_nombre,
          contacto_numero_identificacion:
            documento.contacto_numero_identificacion,
          contacto_nombre_corto: documento.contacto_nombre_corto,
          subtotal: documento.subtotal,
          impuesto: documento.impuesto,
          total: documento.total,
          saldo: documento.saldo,
        }));
        this.changeDetectorRef.detectChanges();
      });
  }

  cambiarPaginacion(data: { desplazamiento: number; limite: number }) {
    this.queryParams = {
      ...this.queryParams,
      ...this.filtros,
      page: data.desplazamiento,
    };
    this.consultarLista();
  }

  descargarExcel() {
    this.descargarArchivosService.exportarExcel(
      'cartera/informe/pendiente-corte',
      {
        ...this.queryParams,
        excel_informe: 'True',
      },
    );
  }

  filterChange(filters: FilterCondition[]) {
      const apiParams =
        this._filterTransformerService.transformToApiParams(filters);
  
      this.queryParams = {
        ...this.queryParams,
        ...apiParams,
      };

      this.consultarLista();
    }

  private _construirFiltros() {
    const filtroGuardado = localStorage.getItem(this.filtroKey);

    // if (filtroGuardado) {
    //   const parametrosConsulta: ParametrosFiltros = {
    //     ...this.arrParametrosConsulta,
    //     filtros: [...JSON.parse(filtroGuardado)],
    //   };

    //   this.arrParametrosConsulta = parametrosConsulta;
    // }
  }
}
