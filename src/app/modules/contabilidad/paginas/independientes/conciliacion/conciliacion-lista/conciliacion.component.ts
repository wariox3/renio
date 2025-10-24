import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { documentos } from '@comun/extra/mapeo-entidades/informes';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { GeneralService } from '@comun/services/general.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import {
  ParametrosApi,
  RespuestaApi,
} from 'src/app/core/interfaces/api.interface';
import { FiltroComponent } from '@comun/componentes/ui/tabla/filtro/filtro.component';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';
import { FilterCondition } from 'src/app/core/interfaces/filtro.interface';
import { NominaInforme } from '@modulos/compra/interfaces/nomina-informe.interface';
import { NOMINA_INFORME_FILTERS } from '@modulos/humano/domain/mapeo/nomina-informe.mapeo';
import { Router } from '@angular/router';
import { combineLatest, finalize } from 'rxjs';
import { ConciliacionService } from '@modulos/contabilidad/servicios/conciliacion.service';

@Component({
  selector: 'app-conciliacion',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    TablaComponent,
    TranslateModule,
    FiltroComponent,
  ],
  templateUrl: './conciliacion.component.html',
})
export class ConciliacionComponent extends General implements OnInit {
  private _filterTransformService = inject(FilterTransformerService);
  private _conciliacionService = inject(ConciliacionService);
  private _router = inject(Router);
  private _descargarArchivosService = inject(DescargarArchivosService);

  public CAMPOS_FILTRO = NOMINA_INFORME_FILTERS;
  arrDocumentos: any = [];
  cantidadRegistros = signal<number>(0);
  parametrosApiPermanente: ParametrosApi = {
    documento_tipo__documento_clase_id: 701,
    serializador: 'nomina',
    limit: 50,
  };

  parametrosApi: ParametrosApi = {
    ...this.parametrosApiPermanente,
  };

  private readonly _generalService = inject(GeneralService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: documentos['conciliacion'] }),
    );
    this.consultarLista();
    this.changeDetectorRef.detectChanges();
  }

  consultarLista() {
    this._generalService
      .consultaApi<
        RespuestaApi<NominaInforme>
      >('contabilidad/conciliacion/', this.parametrosApi)
      .subscribe((respuesta) => {
        this.cantidadRegistros.set(respuesta.count);
        this.arrDocumentos = respuesta.results;
        this.changeDetectorRef.detectChanges();
      });
  }

  obtenerFiltros(filtros: FilterCondition[]) {
    const apiParams =
      this._filterTransformService.transformToApiParams(filtros);

    this.parametrosApi = {
      ...this.parametrosApiPermanente,
      ...apiParams,
    };

    this.consultarLista();
  }

  cambiarPaginacion(data: { desplazamiento: number; limite: number }) {
    this.parametrosApi = {
      ...this.parametrosApi,
      page: data.desplazamiento,
    };

    this.consultarLista();
  }

  descargarExcel() {
    const params: ParametrosApi = {
      ...this.parametrosApi,
      serializador: 'informe_nomina',
      excel_informe: 'True',
    };

    this._descargarArchivosService.exportarExcel('general/documento', params);
    this.changeDetectorRef.detectChanges();
  }

  navegarNuevo() {
    this._router.navigate(['contabilidad/especial/conciliacion/nuevo']);
  }

  navegarDetalle(id: number) {
    this._router.navigate(['contabilidad/especial/conciliacion/detalle', id]);
  }

  navegarEditar(id: number) {
    this._router.navigate(['contabilidad/especial/conciliacion/editar', id]);
  }

  eliminarRegistros(data: Number[]) {
    if (data.length > 0) {
      const eliminarSolicitudes = data.map((id) => {
        return this._conciliacionService.eliminarConciliacion(Number(id));
      });

      combineLatest(eliminarSolicitudes)
        .pipe(
          finalize(() => {
            this.consultarLista();
          }),
        )
        .subscribe((respuesta: any) => {
          this.alertaService.mensajaExitoso('Registro eliminado');
          this.changeDetectorRef.detectChanges();
        });
    } else {
      this.alertaService.mensajeError(
        'Error',
        'No se han seleccionado registros para eliminar',
      );
    }
  }
}
