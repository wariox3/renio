import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-conciliacion-tabla-soporte',
  standalone: true,
  imports: [CommonModule, NgbTooltipModule, TranslateModule],
  templateUrl: './conciliacion-tabla-soporte.html',
  styleUrl: './conciliacion-tabla-soporte.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConciliacionTablaSoporteComponent {
  public arrConciliacionSoporte = signal<any[]>([]);
  public isCheckedSeleccionarTodos = signal<boolean>(false);

  constructor() {
    // Datos de ejemplo - esto debería venir del servicio
    this.arrConciliacionSoporte.set([
      {
        id: 1,
        fecha: '2024-01-15',
        debito: 2500000,
        credito: 0,
        descripcion: 'Transferencia bancaria recibida',
        selected: false
      },
      {
        id: 2,
        fecha: '2024-01-16',
        debito: 0,
        credito: 1200000,
        descripcion: 'Pago a proveedor por transferencia',
        selected: false
      },
      {
        id: 3,
        fecha: '2024-01-17',
        debito: 800000,
        credito: 0,
        descripcion: 'Depósito en efectivo',
        selected: false
      }
    ]);
  }

  toggleSelectAll(event: any) {
    const isChecked = event.target.checked;
    this.isCheckedSeleccionarTodos.set(isChecked);
    
    // Actualizar selección de todos los items
    const items = this.arrConciliacionSoporte();
    items.forEach(item => item.selected = isChecked);
    this.arrConciliacionSoporte.set([...items]);
  }

  toggleItemSelection(item: any) {
    item.selected = !item.selected;
    
    // Verificar si todos están seleccionados
    const items = this.arrConciliacionSoporte();
    const allSelected = items.every(i => i.selected);
    this.isCheckedSeleccionarTodos.set(allSelected);
    
    this.arrConciliacionSoporte.set([...items]);
  }

  eliminarRegistros() {
    const itemsSeleccionados = this.arrConciliacionSoporte().filter(item => item.selected);
    if (itemsSeleccionados.length > 0) {
      // Aquí iría la lógica para eliminar los registros
      console.log('Eliminar registros:', itemsSeleccionados);
      
      // Filtrar los items no seleccionados
      const itemsRestantes = this.arrConciliacionSoporte().filter(item => !item.selected);
      this.arrConciliacionSoporte.set(itemsRestantes);
      this.isCheckedSeleccionarTodos.set(false);
    }
  }

  cargarSoporte() {
    // Aquí iría la lógica para cargar soporte
    console.log('Cargar soporte');
  }

  exportarExcel() {
    // Aquí iría la lógica para exportar a Excel
    console.log('Exportar a Excel');
  }
}
