import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ConciliacionService } from '@modulos/contabilidad/servicios/conciliacion.service';
import { ImportarComponent } from '@comun/components/importar/importar.component';
import { ConciliacionSoporte } from '@modulos/contabilidad/interfaces/conciliacion.interface';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { AlertaService } from '@comun/services/alerta.service';
import { combineLatest } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SiNoPipe } from '@pipe/si-no.pipe';
import { PaginadorComponent } from '@comun/componentes/ui/tabla/paginador/paginador.component';
import { FiltroComponent } from '@comun/componentes/ui/tabla/filtro/filtro.component';
import { CONCILIACION_SOPORTE_FILTERS } from '@modulos/contabilidad/domain/mapeos/conciliacion-soporte.mapeo';
import { FilterCondition } from 'src/app/core/interfaces/filtro.interface';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';
import { ParametrosApi } from 'src/app/core/interfaces/api.interface';

@Component({
  selector: 'app-conciliacion-tabla-soporte',
  standalone: true,
  imports: [
    CommonModule,
    NgbTooltipModule,
    TranslateModule,
    ImportarComponent,
    SiNoPipe,
    PaginadorComponent,
    FiltroComponent,
  ],
  templateUrl: './conciliacion-tabla-soporte.component.html',
  styleUrl: './conciliacion-tabla-soporte.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConciliacionTablaSoporteComponent implements OnInit, OnChanges {
  @Input() conciliacionId: number = 0;

  public conciliacionSoportes = signal<ConciliacionSoporte[]>([]);
  public registrosSeleccionados = signal<number[]>([]);
  public cantidadRegistros = signal<number>(0);
  public CONCILIACION_SOPORTE_FILTERS = CONCILIACION_SOPORTE_FILTERS;
  public arrParametrosConsulta = signal<ParametrosApi>({});
  private _parametrosPaginacion = {
    page: 1,
  };

  private readonly _modalService = inject(NgbModal);
  private readonly _conciliacionService = inject(ConciliacionService);
  private readonly _descargarArchivosService = inject(DescargarArchivosService);
  private readonly _changeDetectorRef = inject(ChangeDetectorRef);
  private readonly _alertaService = inject(AlertaService);
  private readonly _filterTransformerService = inject(FilterTransformerService);

  @ViewChild('checkboxSelectAll') checkboxAll: ElementRef;

  constructor() {
    // Datos de ejemplo - esto debería venir del servicio
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conciliacionId'] && this.conciliacionId && this.conciliacionId > 0) {
      this.consultarLista();
    }
  }

  consultarLista() {
    const parametros = {
      conciliacion_id: this.conciliacionId,
      page: this._parametrosPaginacion.page,
      ...this.arrParametrosConsulta(),
    };

    this._conciliacionService
      .consultarConciliacionSoporte(parametros)
      .subscribe((respuesta) => {
        this.conciliacionSoportes.set(respuesta.results);
        this.cantidadRegistros.set(respuesta.count || 0);
      });
  }

  manejarCheckGlobal(event: any) {
    if (event.target.checked) {
      this._agregarTodosLosItemsAListaEliminar();
    } else {
      this._removerTodosLosItemsAListaEliminar();
    }

    this._changeDetectorRef.detectChanges();
  }

  manejarCheckItem(event: any, id: number) {
    if (event.target.checked) {
      this._agregarItemAListaEliminar(id);
    } else {
      this._removerItemDeListaEliminar(id);
    }

    this._changeDetectorRef.detectChanges();
  }

  limpiarRegistros() {
    this._conciliacionService.limpiarSoporte(this.conciliacionId).subscribe({
      next: (respuesta: any) => {
        this._alertaService.mensajaExitoso(
          'Registros eliminados correctamente',
        );
        this.consultarLista();
      },
      error: (error) => {
        this._alertaService.mensajeError(
          'Error',
          'Error al eliminar algunos registros',
        );
      },
    });
    // if (this.registrosSeleccionados().length > 0) {
    //   const idsAEliminar = this.registrosSeleccionados();

    //   const eliminarSolicitudes = idsAEliminar.map((id) => {
    //     return this._conciliacionService.eliminarSoporte(id);
    //   });

    //   combineLatest(eliminarSolicitudes)
    //     .pipe(
    //       finalize(() => {
    //         this.checkboxAll.nativeElement.checked = false;
    //         this.reiniciarRegistrosSeleccionados();
    //         this.consultarLista();
    //         this._changeDetectorRef.detectChanges();
    //       }),
    //     )
    //     .subscribe({
    //       next: (respuesta: any) => {
    //         this._alertaService.mensajaExitoso('Registros eliminados correctamente');
    //       },
    //       error: (error) => {
    //         this._alertaService.mensajeError('Error', 'Error al eliminar algunos registros');
    //       }
    //     });
    // } else {
    //   this._alertaService.mensajeError('Error', 'No se han seleccionado registros para eliminar');
    // }
  }

  cargarSoporte(modal: any) {
    this._modalService.open(modal, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
  }

  exportarExcel() {
    this._descargarArchivosService.exportarExcel(
      'contabilidad/conciliacion_soporte',
      { conciliacion_id: this.conciliacionId, serializador: 'excel' },
    );
  }

  estoyEnListaEliminar(id: number): boolean {
    return this.registrosSeleccionados().indexOf(id) !== -1;
  }

  cambiarPaginacion(page: number) {
    this._parametrosPaginacion.page = page;
    this.consultarLista();
  }

  filterChange(filters: FilterCondition[]) {
    const apiParams = this._filterTransformerService.transformToApiParams(filters);

    if (Object.keys(apiParams).length > 0) {
      this.arrParametrosConsulta.set(apiParams);
    } else {
      this.arrParametrosConsulta.set({});
    }

    this._parametrosPaginacion.page = 1;
    this.consultarLista();
  }

  private _agregarTodosLosItemsAListaEliminar() {
    this.conciliacionSoportes().forEach((registro) => {
      const indexItem = this.registrosSeleccionados().indexOf(registro.id);

      if (indexItem === -1) {
        this.registrosSeleccionados().push(registro.id);
      }
    });
  }

  private _removerTodosLosItemsAListaEliminar() {
    this.reiniciarRegistrosSeleccionados();
  }

  private _agregarItemAListaEliminar(id: number) {
    this.registrosSeleccionados().push(id);
  }

  private _removerItemDeListaEliminar(id: number) {
    const itemsFiltrados = this.registrosSeleccionados().filter(
      (item) => item !== id,
    );
    this.registrosSeleccionados.set(itemsFiltrados);
  }

  private reiniciarRegistrosSeleccionados() {
    this.registrosSeleccionados.set([]);
  }
}
