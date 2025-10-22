import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ConciliacionService } from '@modulos/contabilidad/servicios/conciliacion.service';

@Component({
  selector: 'app-conciliacion-tabla-detalle',
  standalone: true,
  imports: [CommonModule, NgbTooltipModule, TranslateModule],
  templateUrl: './conciliacion-tabla-detalle.html',
})
export class ConciliacionTablaDetalleComponent implements OnInit {
  public arrConciliacionDetalle = signal<any[]>([]);
  public isCheckedSeleccionarTodos = signal<boolean>(false);
  private readonly _conciliacionService = inject(ConciliacionService);

  constructor() {
  }

  ngOnInit(): void {
    this.consultarDetalle();
  }

  consultarDetalle() {
    this._conciliacionService
      .consultarConciliacionDetalle(5)
      .subscribe((respuesta) => {
        //console.log(respuesta);
        this.arrConciliacionDetalle.set(respuesta.results);
        //this.conciliacion.set(respuesta);
      });
  }

  toggleSelectAll(event: any) {
    const isChecked = event.target.checked;
    this.isCheckedSeleccionarTodos.set(isChecked);

    // Actualizar selección de todos los items
    const items = this.arrConciliacionDetalle();
    items.forEach(item => item.selected = isChecked);
    this.arrConciliacionDetalle.set([...items]);
  }

  toggleItemSelection(item: any) {
    item.selected = !item.selected;

    // Verificar si todos están seleccionados
    const items = this.arrConciliacionDetalle();
    const allSelected = items.every(i => i.selected);
    this.isCheckedSeleccionarTodos.set(allSelected);

    this.arrConciliacionDetalle.set([...items]);
  }

  eliminarRegistros() {
    const itemsSeleccionados = this.arrConciliacionDetalle().filter(item => item.selected);
    if (itemsSeleccionados.length > 0) {
      // Aquí iría la lógica para eliminar los registros
      console.log('Eliminar registros:', itemsSeleccionados);
    }
  }

  exportarExcel() {
    // Aquí iría la lógica para exportar a Excel
    console.log('Exportar a Excel');
  }

  limpiarRegistros() {
    // Aquí iría la lógica para limpiar todos los registros
    console.log('Limpiar registros');
    this.arrConciliacionDetalle.set([]);
    this.isCheckedSeleccionarTodos.set(false);
  }

  cargarDatos() {
    // Aquí iría la lógica para cargar datos
    console.log('Cargar datos');
  }

  conciliar() {
    // Aquí iría la lógica para conciliar
    console.log('Conciliar registros');
  }
}
