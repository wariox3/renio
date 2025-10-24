import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ConciliacionService } from '@modulos/contabilidad/servicios/conciliacion.service';
import { HttpService } from '@comun/services/http.service';
import { AlertaService } from '@comun/services/alerta.service';
import { PaginadorComponent } from '@comun/componentes/ui/tabla/paginador/paginador.component';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { SiNoPipe } from '@pipe/si-no.pipe';

@Component({
  selector: 'app-conciliacion-tabla-detalle',
  standalone: true,
  imports: [
    CommonModule,
    NgbTooltipModule,
    TranslateModule,
    PaginadorComponent,
    SiNoPipe
  ],
  templateUrl: './conciliacion-tabla-detalle.component.html',
  styleUrls: ['./conciliacion-tabla-detalle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConciliacionTablaDetalleComponent implements OnInit {
  @Input() set conciliacionId(value: number) {
    this._conciliacionId.set(value);
  }
  
  private readonly _descargarArchivosService = inject(DescargarArchivosService);
  private readonly _conciliacionService = inject(ConciliacionService);
  private readonly _httpService = inject(HttpService);
  private readonly _alertaService = inject(AlertaService);

  private _conciliacionId = signal<number>(0);
  public conciliacionDetalles = signal<any[]>([]);
  public isCheckedSeleccionarTodos = signal<boolean>(false);
  public cantidadRegistros = signal<number>(0);
  
  // Parámetros de paginación
  private _parametrosPaginacion = {
    page: 1
  };

  constructor() {
    // Effect para detectar cuando cambia el conciliacionId
    effect(() => {
      const id = this._conciliacionId();
      if (id && id > 0) {
        this.consultarDetalle();
      }
    });
  }

  ngOnInit(): void {
    // Ya no necesitamos llamar consultarDetalle aquí
  }
  
  consultarDetalle() {
    const parametros = {
      conciliacion_id: this._conciliacionId(),
      page: this._parametrosPaginacion.page
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
      { conciliacion_id: this._conciliacionId() },
    );
  }

  limpiarRegistros() {
    this._conciliacionService
    .limpiarDetalles(this._conciliacionId())
    .subscribe({
      next: (respuesta: any) => {
        this._alertaService.mensajaExitoso('Detalles limpiados correctamente');
        this.consultarDetalle();
      },
      error: (error) => {
        this._alertaService.mensajeError('Error', 'Error al limpiar los detalles');
      }
    });
  }

  cargarDetalle() {
    this._conciliacionService
      .cargarDetalle(this._conciliacionId())
      .subscribe({
        next: (respuesta: any) => {
          this._alertaService.mensajaExitoso('Detalles cargados correctamente');
          this.consultarDetalle();
        },
        error: (error) => {
          this._alertaService.mensajeError('Error', 'Error al cargar los detalles');
        }
      });
  }

  conciliar() {
    this._httpService
      .post('contabilidad/conciliacion/conciliar/', {
        id: this._conciliacionId()
      })
      .subscribe({
        next: (respuesta: any) => {
          this._alertaService.mensajaExitoso('Detalles conciliados correctamente');
          this.consultarDetalle();
        },
        error: (error) => {
          this._alertaService.mensajeError('Error', 'Error al conciliar los detalles');
        }
      });
  }

  cambiarPaginacion(page: number) {
    this._parametrosPaginacion.page = page;
    this.consultarDetalle();
  }
}
