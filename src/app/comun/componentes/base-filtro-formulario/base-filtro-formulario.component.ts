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
import { obtenerMenuDataMapeoCamposVisibleFiltros } from '@redux/selectors/menu.selectors';
import { KeysPipe } from '@pipe/keys.pipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '@comun/services/http.service';
@Component({
  selector: 'app-base-filtro-formulario',
  standalone: true,
  imports: [CommonModule, TranslateModule, TranslationModule, KeysPipe],
  templateUrl: './base-filtro-formulario.component.html',
})
export class BaseFiltroFormularioComponent
  extends General
  implements OnInit, OnChanges
{
  camposVisibles: any;
  filtroCampoNombre = '';
  filtroCampoCriterio = '';
  filtroCampoValor1: any = '';
  filtroCampoNombreFk: any = '';
  filtroTipo: any = '';
  busquedaAvanzada = '';
  modeloBusquedaAvanzada = '';
  arrRegistros: any = []
  @Input() datosSeleccionados: any | null;
  @Output() dataPropiedad: EventEmitter<any> = new EventEmitter();
  @Output() dataOperador: EventEmitter<any> = new EventEmitter();
  @Output() dataValor1: EventEmitter<any> = new EventEmitter();

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

  constructor(
    private modalService: NgbModal,
    private httpService: HttpService
  ) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.tipo = localStorage.getItem('itemTipo')!;
      this.construirFiltros(parametro.modelo);
    });
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
      this.filtroCampoValor1 = changes.datosSeleccionados.currentValue.valor1;
      this.changeDetectorRef.detectChanges();
    }
  }

  construirFiltros(modelo: string) {
    this.store
      .select(obtenerMenuDataMapeoCamposVisibleFiltros)
      .subscribe((campos) => (this.camposVisibles = campos));
    this.changeDetectorRef.detectChanges();
  }

  propiedadSeleccionada(event: any): void {
    this.filtroCampoValor1 = ''
    const selectedValue = event.target.value;
    this.filtroTipo = event.target.value
    const selectedOption = event.target.selectedOptions[0];
    this.criteriosBusqueda = this.datosCriteriosBusqueda[selectedValue];

    this.busquedaAvanzada = selectedOption.getAttribute(
      'data-modelo-busqueda-avanzada'
    );
    this.modeloBusquedaAvanzada = selectedOption.getAttribute(
      'data-modelo-busqueda-avanzada'
    );

    console.log({
      campo: selectedOption.getAttribute('data-value') ?? '',
      tipo: selectedValue,
    });
    
    this.dataPropiedad.emit({
      campo: selectedOption.getAttribute('data-value') ?? '',
      tipo: selectedValue,
    });
  }

  onCriterioSeleccionado(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.dataOperador.emit(target.value);
  }

  abirModal(content: any) {
    this.consultarLista();
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.changeDetectorRef.detectChanges();
  }

  consultarLista() {
    this.httpService
      .post<{
        cantidad_registros: number;
        registros: any[];
        propiedades: any[];
      }>('general/funcionalidad/lista-buscar/', {
        modelo: this.modeloBusquedaAvanzada,
      })
      .subscribe((respuesta) => {
        this.arrRegistros = respuesta.registros;

        this.changeDetectorRef.detectChanges();
      });
  }

  seleccionar(item: any) {
    this.modalService.dismissAll();
    this.filtroCampoValor1 = Object.values(item)[0]
    this.filtroCampoNombreFk = Object.values(item)[2]
    this.dataValor1.emit(Object.values(item)[0]);
  }

  actualizarCampoValor1(event: Event){
    const target = event.target as HTMLSelectElement;
    this.dataValor1.emit(target.value);

  }

}
