import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-conciliacion-tabla-detalle',
  standalone: true,
  imports: [CommonModule, NgbTooltipModule, TranslateModule],
  templateUrl: './conciliacion-tabla-detalle.html',
  styleUrl: './conciliacion-tabla-detalle.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConciliacionTablaDetalleComponent {
  public arrConciliacionDetalle = signal<any[]>([]);
  public isCheckedSeleccionarTodos = signal<boolean>(false);

  constructor() {
    // Datos de ejemplo - esto debería venir del servicio
    this.arrConciliacionDetalle.set([
      {
        id: 1,
        modelo: 'Factura',
        numero: 'FV-001',
        fecha: '2024-01-15',
        cuenta: '1105 - Caja',
        debito: 1500000,
        credito: 0,
        descripcion: 'Venta de productos'
      },
      {
        id: 2,
        modelo: 'Compra',
        numero: 'CP-001',
        fecha: '2024-01-16',
        cuenta: '2205 - Proveedores',
        debito: 0,
        credito: 800000,
        descripcion: 'Compra de mercancía'
      }
    ]);
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
