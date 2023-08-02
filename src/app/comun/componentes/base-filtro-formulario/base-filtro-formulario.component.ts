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

  ciudadesPorPais: { [key: string]: string[] } = {
    Numero: ['igual', 'mayor', 'mayor igual', 'menor', 'menor igual', 'entre'],
    Texto: [
      'igual',
      'diferente',
      'contiene',
      'no contiene',
      'está establecida(o)',
      'no está establecida(o)',
    ],
    Booleano: ['es', 'no'],
    Fecha: ['entre', 'desde', 'hasta'],
  };
  ciudades: string[] = [];

  ngOnInit(): void {
    console.log(this.datosSeleccionados);

    if(this.datosSeleccionados){
      this.ciudades = this.ciudadesPorPais[this.datosSeleccionados.propiedad];
    }
  }

  onPaisSeleccionado(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const pais = target.value;
    this.ciudades = this.ciudadesPorPais[pais];
    this.dataPropiedad.emit(target.value);
  }

  onCriterioSeleccionado(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.dataOperador.emit(target.value);
  }
}
