import { General } from '@comun/clases/general';
import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
@Component({
  selector: 'app-base-filtro-formulario',
  standalone: true,
  imports: [CommonModule, TranslateModule, TranslationModule],
  templateUrl: './base-filtro-formulario.component.html',
})
export class BaseFiltroFormularioComponent
  extends General
  implements OnInit, OnChanges
{
  camposVisibles: any;
  filtroCampoNombre = '';
  filtroCampoCriterio = '';
  modelo: string;
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
        texto: 'MENORIGUALQUE',
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
        texto: 'MENORIGUALQUE',
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

  ngOnInit(): void {
    // this.activatedRoute.queryParams.subscribe((parametro) => {
    //   this.modelo = parametro.modelo;
    //   this.construirFiltros(parametro.modelo);
    // });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.datosSeleccionados && changes.datosSeleccionados.currentValue) {
      this.filtroCampoNombre =
        changes.datosSeleccionados.currentValue.propiedad;
      this.filtroCampoCriterio =
        changes.datosSeleccionados.currentValue.operador;
      this.criteriosBusqueda =
        this.datosCriteriosBusqueda[
          changes.datosSeleccionados.currentValue.tipo
        ];
      this.changeDetectorRef.detectChanges();
    }
  }

  construirFiltros(modelo: string) {
    // this.camposVisibles = mapeo[modelo].datos.filter(
    //   (titulo: any) => titulo.visibleFiltro === true
    // );
    // this.changeDetectorRef.detectChanges();
  }

  propiedadSeleccionada(event: any): void {
    const selectedValue = event.target.value; // Valor seleccionado en el select
    const selectedOption = event.target.selectedOptions[0]; // Opción seleccionada
    this.criteriosBusqueda = this.datosCriteriosBusqueda[selectedValue];
    this.dataPropiedad.emit({
      campo: selectedOption.getAttribute('data-value') ?? '',
      tipo: selectedValue,
    });
  }

  onCriterioSeleccionado(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.dataOperador.emit(target.value);
  }
}
