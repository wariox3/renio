import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { FiltroComponent } from '@comun/componentes/ui/tabla/filtro/filtro.component';
import { documentos } from '@comun/extra/mapeo-entidades/informes';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { GeneralService } from '@comun/services/general.service';
import { NominaInforme } from '@modulos/compra/interfaces/nomina-informe.interface';
import { CONCILIACION_FILTERS } from '@modulos/contabilidad/domain/mapeos/conciliacion.mapeo';
import { ConciliacionService } from '@modulos/contabilidad/servicios/conciliacion.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { combineLatest, finalize } from 'rxjs';
import {
  ParametrosApi,
  RespuestaApi,
} from 'src/app/core/interfaces/api.interface';
import { FilterCondition } from 'src/app/core/interfaces/filtro.interface';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';

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
  private readonly _generalService = inject(GeneralService);

  public CAMPOS_FILTRO = CONCILIACION_FILTERS;
  public arrDocumentos: any = [];
  public cantidadRegistros = signal<number>(0);
  public parametrosApiPermanente: ParametrosApi = {};
  public parametrosApi: ParametrosApi = {
    ...this.parametrosApiPermanente,
  };

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: documentos['conciliacion'] }),
    );
    this.consultarLista();
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
    };

    this._descargarArchivosService.exportarExcel(
      'contabilidad/conciliacion',
      params,
    );
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
