import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgxDropdownConfig, SelectDropDownModule } from 'ngx-select-dropdown';

@Component({
  selector: 'app-comun-select2',
  standalone: true,
  imports: [
    CommonModule,
    SelectDropDownModule,
  ],
  templateUrl: './select2.component.html',
  styleUrl: './select2.component.scss',
})
export class Select2Component {

  @Input() arrDatos: any[] = [];
  @Input() claveNombre:string = '';
  @Input() claveId:string = '';
  @Output() emitirClaveId: EventEmitter<any> = new EventEmitter();


    // Configuración del dropdown
    config: NgxDropdownConfig = {
      displayFn:(item: any) => { return item[this.claveNombre] },
      displayKey: this.claveNombre, // Campo a mostrar en la lista desplegable
      search: true, // Habilitar búsqueda
      height: 'auto', // Altura automática
      placeholder: 'Selecciona una opción', // Texto del placeholder
      limitTo: 0, // Limita las opciones (0 = sin límite)
      moreText: 'más', // Texto cuando hay más opciones seleccionadas
      noResultsFound: 'No se encontraron resultados!', // Texto cuando no se encuentran resultados
      searchPlaceholder: 'Buscar', // Placeholder de búsqueda
      searchOnKey: this.claveNombre // Campo sobre el cual realizar la búsqueda (en caso de ser objetos)
    };


  seleccionarConceptoAdcional(item: any) {
    this.emitirClaveId.emit(item.value[this.claveId])
  }
}
