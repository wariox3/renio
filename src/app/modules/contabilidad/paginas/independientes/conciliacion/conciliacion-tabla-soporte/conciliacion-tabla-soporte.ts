import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ConciliacionService } from '@modulos/contabilidad/servicios/conciliacion.service';

@Component({
  selector: 'app-conciliacion-tabla-soporte',
  standalone: true,
  imports: [CommonModule, NgbTooltipModule, TranslateModule],
  templateUrl: './conciliacion-tabla-soporte.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConciliacionTablaSoporteComponent implements OnInit {
  public arrConciliacionSoporte = signal<any[]>([]);
  public isCheckedSeleccionarTodos = signal<boolean>(false);
  private readonly _conciliacionService = inject(ConciliacionService);

  constructor() {
    // Datos de ejemplo - esto debería venir del servicio
  }

  ngOnInit(): void {
    this.consultarLista();
  }

  consultarLista() {
    this._conciliacionService
      .consultarConciliacionDetalle(5)
      .subscribe((respuesta) => {
        //console.log(respuesta);
        this.arrConciliacionSoporte.set(respuesta.results);
        //this.conciliacion.set(respuesta);
      });
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
