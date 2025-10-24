import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ConciliacionService } from '@modulos/contabilidad/servicios/conciliacion.service';
import { HttpService } from '@comun/services/http.service';
import { AlertaService } from '@comun/services/alerta.service';
import { PaginadorComponent } from '@comun/componentes/ui/tabla/paginador/paginador.component';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { SiNoPipe } from '@pipe/si-no.pipe';
import { FiltroComponent } from '@comun/componentes/ui/tabla/filtro/filtro.component';
import { CONCILIACION_DETALLE_FILTERS } from '@modulos/contabilidad/domain/mapeos/conciliacion-detalle.mapeo';
import { FilterCondition } from 'src/app/core/interfaces/filtro.interface';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';
import { ParametrosApi } from 'src/app/core/interfaces/api.interface';

@Component({
  selector: 'app-conciliacion-tabla-detalle',
  standalone: true,
  imports: [
    CommonModule,
    NgbTooltipModule,
    TranslateModule,
    PaginadorComponent,
    SiNoPipe,
    FiltroComponent,
  ],
  templateUrl: './conciliacion-tabla-detalle.component.html',
  styleUrls: ['./conciliacion-tabla-detalle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConciliacionTablaDetalleComponent implements OnInit, OnChanges {
  @Input() conciliacionId: number = 0;

  private readonly _descargarArchivosService = inject(DescargarArchivosService);
  private readonly _conciliacionService = inject(ConciliacionService);
  private readonly _httpService = inject(HttpService);
  private readonly _alertaService = inject(AlertaService);
  private readonly _filterTransformerService = inject(FilterTransformerService);

  public conciliacionDetalles = signal<any[]>([]);
  public isCheckedSeleccionarTodos = signal<boolean>(false);
  public cantidadRegistros = signal<number>(0);
  public CONCILIACION_DETALLE_FILTERS = CONCILIACION_DETALLE_FILTERS;
  public arrParametrosConsulta = signal<ParametrosApi>({});

  // Parámetros de paginación
  private _parametrosPaginacion = {
    page: 1,
  };

  constructor() {}

  ngOnInit(): void {}

  private cargarFiltrosGuardados() {
    const filtrosGuardados = localStorage.getItem('conciliacion_detalle');
    if (filtrosGuardados !== null) {
      try {
        const filtrosParsed = JSON.parse(filtrosGuardados);
        if (
          filtrosParsed &&
          Array.isArray(filtrosParsed) &&
          filtrosParsed.length > 0
        ) {
          const apiParams =
            this._filterTransformerService.transformToApiParams(filtrosParsed);
          if (Object.keys(apiParams).length > 0) {
            this.arrParametrosConsulta.set(apiParams);
          }
        }
      } catch (error) {
        console.warn('Error al parsear filtros guardados:', error);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['conciliacionId'] &&
      this.conciliacionId &&
      this.conciliacionId > 0
    ) {
      this.cargarFiltrosGuardados();
      this.consultarDetalle();
    }
  }

  consultarDetalle() {
    const parametros = {
      conciliacion_id: this.conciliacionId,
      page: this._parametrosPaginacion.page,
      ...this.arrParametrosConsulta(),
    };

    this._conciliacionService
      .consultarConciliacionDetalle(parametros)
      .subscribe((respuesta) => {
        //console.log(respuesta);
        this.conciliacionDetalles.set(respuesta.results);
        this.cantidadRegistros.set(respuesta.count || 0);
        //this.conciliacion.set(respuesta);
      });
  }

  toggleSelectAll(event: any) {
    // const isChecked = event.target.checked;
    // this.isCheckedSeleccionarTodos.set(isChecked);
    // // Actualizar selección de todos los items
    // const items = this.conciliacionDetalles();
    // items.forEach(item => item.selected = isChecked);
    // this.conciliacionDetalles.set([...items]);
  }

  toggleItemSelection(item: any) {
    // item.selected = !item.selected;
    // // Verificar si todos están seleccionados
    // const items = this.conciliacionDetalles();
    // const allSelected = items.every(i => i.selected);
    // this.isCheckedSeleccionarTodos.set(allSelected);
    // this.conciliacionDetalles.set([...items]);
  }

  eliminarRegistros() {
    // const itemsSeleccionados = this.conciliacionDetalles().filter(item => item.selected);
    // if (itemsSeleccionados.length > 0) {
    //   // Aquí iría la lógica para eliminar los registros
    //   console.log('Eliminar registros:', itemsSeleccionados);
    // }
  }

  exportarExcel() {
    this._descargarArchivosService.exportarExcel(
      'contabilidad/conciliacion_detalle',
      { conciliacion_id: this.conciliacionId, serializador: 'excel' },
    );
  }

  limpiarRegistros() {
    this._conciliacionService.limpiarDetalles(this.conciliacionId).subscribe({
      next: (respuesta: any) => {
        this._alertaService.mensajaExitoso('Detalles limpiados correctamente');
        this.consultarDetalle();
      },
      error: (error) => {
        this._alertaService.mensajeError(
          'Error',
          'Error al limpiar los detalles',
        );
      },
    });
  }

  cargarDetalle() {
    this._conciliacionService.cargarDetalle(this.conciliacionId).subscribe({
      next: (respuesta: any) => {
        this._alertaService.mensajaExitoso('Detalles cargados correctamente');
        this.consultarDetalle();
      },
      error: (error) => {
        this._alertaService.mensajeError(
          'Error',
          'Error al cargar los detalles',
        );
      },
    });
  }

  conciliar() {
    this._httpService
      .post('contabilidad/conciliacion/conciliar/', {
        id: this.conciliacionId,
      })
      .subscribe({
        next: (respuesta: any) => {
          this._alertaService.mensajaExitoso(
            'Detalles conciliados correctamente',
          );
          this.consultarDetalle();
        },
        error: (error) => {
          this._alertaService.mensajeError(
            'Error',
            'Error al conciliar los detalles',
          );
        },
      });
  }

  cambiarPaginacion(page: number) {
    this._parametrosPaginacion.page = page;
    this.consultarDetalle();
  }

  filterChange(filters: FilterCondition[]) {
    const apiParams =
      this._filterTransformerService.transformToApiParams(filters);

    if (Object.keys(apiParams).length > 0) {
      this.arrParametrosConsulta.set(apiParams);
    } else {
      this.arrParametrosConsulta.set({});
    }

    this._parametrosPaginacion.page = 1;
    this.consultarDetalle();
  }
}
