import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Listafiltros } from '@interfaces/comunes/filtros';

@Component({
  selector: 'app-base-filtro-formulario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './base-filtro-formulario.component.html',
})
export class BaseFiltroFormularioComponent implements OnInit {
  @Input() propiedades: Listafiltros[];
  @Input() datosSeleccionados: any | null;
  @Output() dataPropiedad: EventEmitter<any> = new EventEmitter();
  @Output() dataOperador: EventEmitter<any> = new EventEmitter();

  datosCriteriosBusqueda: {
    [key: string]: {
      valor: string;
      texto: string;
    }[];
  } = {
    Numero: [
      {
        valor: '',
        texto: 'Igual',
      },
      {
        valor: '__gt',
        texto: 'Mayor que',
      },
      {
        valor: '__gte',
        texto: 'Mayor o igual que',
      },
      {
        valor: '__lt',
        texto: 'Menor que',
      },
      {
        valor: '__lte',
        texto: 'Menor o igual que',
      }
    ],
    Texto: [
      {
        valor: '',
        texto: 'Igual',
      },
      {
        valor: '__contains',
        texto: 'Contiene',
      },
    ],
    Fecha: [
      {
        valor: '',
        texto: 'Igual',
      },
      {
        valor: '__gt',
        texto: 'Mayor que',
      },
      {
        valor: '__gte',
        texto: 'Mayor o igual que',
      },
      {
        valor: '__lt',
        texto: 'Menor que',
      },
      {
        valor: '__lte',
        texto: 'Menor o igual que',
      },
    ],
    Booleano: [
      {
        valor: '__is',
        texto: 'es',
      },
      {
        valor: '__no_is',
        texto: 'no',
      },
    ],
  };

  criteriosBusqueda: { valor: string; texto: string }[] = [];

  ngOnInit(): void {
    // if(this.datosSeleccionados){
    //   this.creteriosBusqueda = this.datosCriteriosBusqueda[this.datosSeleccionados.propiedad];
    // }
  }

  propiedadSeleccionada(event: any): void {

    const selectedValue = event.target.value; // Valor seleccionado en el select
    const selectedOption = event.target.selectedOptions[0]; // Opción seleccionada
    this.criteriosBusqueda = this.datosCriteriosBusqueda[selectedValue];    
    this.dataPropiedad.emit( selectedOption.getAttribute('data-value'));
  }

  onCriterioSeleccionado(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.dataOperador.emit(target.value);
  }
}
