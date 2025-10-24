import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ConciliacionService } from '@modulos/contabilidad/servicios/conciliacion.service';
import { HttpService } from '@comun/services/http.service';
import { AlertaService } from '@comun/services/alerta.service';
import { ConciliacionDetalle } from '@modulos/contabilidad/interfaces/conciliacion.interface';

@Component({
  selector: 'app-conciliacion-tabla-detalle',
  standalone: true,
  imports: [
    CommonModule,
    NgbTooltipModule,
    TranslateModule,
  ],
  templateUrl: './conciliacion-tabla-detalle.html',
})
export class ConciliacionTablaDetalleComponent implements OnInit {
  @Input() conciliacionId: number;

  public conciliacionDetalles = signal<ConciliacionDetalle[]>([]);
  public isCheckedSeleccionarTodos = signal<boolean>(false);
  private readonly _conciliacionService = inject(ConciliacionService);
  private readonly _httpService = inject(HttpService);
  private readonly _alertaService = inject(AlertaService);

  constructor() {
  }

  ngOnInit(): void {
    this.consultarDetalle();
  }

  consultarDetalle() {
    this._conciliacionService
      .consultarConciliacionDetalle(this.conciliacionId)
      .subscribe((respuesta) => {
        //console.log(respuesta);
        this.conciliacionDetalles.set(respuesta.results);
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
    // Aquí iría la lógica para exportar a Excel
    console.log('Exportar a Excel');
  }

  limpiarRegistros() {
    // Aquí iría la lógica para limpiar todos los registros
    console.log('Limpiar registros');
    this.conciliacionDetalles.set([]);
    this.isCheckedSeleccionarTodos.set(false);
  }

  cargarDetalle() {
    this._httpService
      .post('contabilidad/conciliacion_detalle/cargar/', {
        conciliacion_id: this.conciliacionId
      })
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
    // Aquí iría la lógica para conciliar
    console.log('Conciliar registros');
  }
}
