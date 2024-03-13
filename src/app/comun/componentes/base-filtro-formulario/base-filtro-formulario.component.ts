import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Listafiltros } from '@interfaces/comunes/filtros';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';

@Component({
  selector: 'app-base-filtro-formulario',
  standalone: true,
  imports: [CommonModule, TranslateModule, TranslationModule],
  templateUrl: './base-filtro-formulario.component.html',
})
export class BaseFiltroFormularioComponent implements OnInit, OnChanges {
  @Input() propiedades: any[];
  @Input() modelo: string;
  @Input() datosSeleccionados: any | null;
  @Output() dataPropiedad: EventEmitter<any> = new EventEmitter();
  @Output() dataOperador: EventEmitter<any> = new EventEmitter();

  datosCriteriosBusqueda: {
    [key: string]: {
      valor: string;
      texto: string;
    }[];
  } = {
    IntegerField: [
      {
        valor: '',
        texto: 'IGUAL',
      },
      {
        valor: '__gt',
        texto: 'MAYORQUE',
      },
      {
        valor: '__gte',
        texto: 'MAYORIGUALQUE',
      },
      {
        valor: '__lt',
        texto: 'MENORQUE',
      },
      {
        valor: '__lte',
        texto: 'MENORIGUALQUE',
      },
    ],
    FloatField: [
      {
        valor: '',
        texto: 'IGUAL',
      },
      {
        valor: '__gt',
        texto: 'MAYORQUE',
      },
      {
        valor: '__gte',
        texto: 'MAYORIGUALQUE',
      },
      {
        valor: '__lt',
        texto: 'MENORQUE',
      },
      {
        valor: '__lte',
        texto: 'Menor o IGUAL que',
      },
    ],
    CharField: [
      {
        valor: '',
        texto: 'IGUAL',
      },
      {
        valor: '__contains',
        texto: 'CONTIENE',
      },
    ],
    DateField: [
      {
        valor: '',
        texto: 'IGUAL',
      },
      {
        valor: '__gt',
        texto: 'MAYORQUE',
      },
      {
        valor: '__gte',
        texto: 'MAYORIGUALQUE',
      },
      {
        valor: '__lt',
        texto: 'MENORQUE',
      },
      {
        valor: '__lte',
        texto: 'Menor o IGUAL que',
      },
    ],
    Booleano: [
      {
        valor: '__is',
        texto: 'ES',
      },
      {
        valor: '__no_is',
        texto: 'NO',
      },
    ],
  };

  criteriosBusqueda: { valor: string; texto: string }[] = [];

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.propiedades && changes.propiedades.currentValue) {
      let dato = changes.propiedades.currentValue.find(
        (item: any) => item.nombre === this.datosSeleccionados?.propiedad
      );
      if (dato) {
        this.criteriosBusqueda = this.datosCriteriosBusqueda[dato?.tipo];
      }
    }
  }

  propiedadSeleccionada(event: any): void {
    const selectedValue = event.target.value; // Valor seleccionado en el select
    const selectedOption = event.target.selectedOptions[0]; // Opción seleccionada
    this.criteriosBusqueda = this.datosCriteriosBusqueda[selectedValue];
    this.dataPropiedad.emit(selectedOption.getAttribute('data-value') ?? '');
  }

  onCriterioSeleccionado(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.dataOperador.emit(target.value);
  }
}
