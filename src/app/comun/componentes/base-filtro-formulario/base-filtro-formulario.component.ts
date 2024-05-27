import { General } from '@comun/clases/general';
import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { obtenerMenuDataMapeoCamposVisibleFiltros } from '@redux/selectors/menu.selectors';
import { KeysPipe } from '@pipe/keys.pipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '@comun/services/http.service';
import { mapeo } from '@comun/extra/mapeoEntidades/buscarAvanzados';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { obtenerCriteriosFiltro } from '@redux/selectors/criteriosFIltro.selectors';
@Component({
  selector: 'app-base-filtro-formulario',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TranslationModule,
    KeysPipe,
    ReactiveFormsModule,
    FormsModule,
  ],
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
  filtroTipoModal: string[] = [];
  busquedaAvanzada = '';
  modeloBusquedaAvanzada = '';
  arrRegistros: any = [];
  propiedadBusquedaAvanzada: any = [];
  formularioFiltrosModal: FormGroup;

  @Input() datosSeleccionados: any | null;
  @Output() dataPropiedad: EventEmitter<any> = new EventEmitter();
  @Output() dataOperador: EventEmitter<any> = new EventEmitter();
  @Output() dataValor1: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputValor1') inputValor1: ElementRef;
  @ViewChild('inputCritero') inputCritero: ElementRef;

  criteriosBusqueda: {
    valor: string | number | boolean;
    texto: string;
    defecto?: boolean;
  }[] = [];
  criteriosBusquedaModal: {
    valor: string | number | boolean;
    texto: string;
    defecto?: boolean;
  }[][] = [];

  constructor(
    private modalService: NgbModal,
    private httpService: HttpService,
    private formBuilder: FormBuilder
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
      this.store
        .select(
          obtenerCriteriosFiltro(changes.datosSeleccionados.currentValue.tipo)
        )
        .subscribe((resultado) => {
          this.criteriosBusqueda = resultado;
        });
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
    this.filtroCampoValor1 = '';
    const selectedValue = event.target.value;
    this.filtroTipo = event.target.value;
    const selectedOption = event.target.selectedOptions[0];
    this.store
      .select(obtenerCriteriosFiltro(selectedValue))
      .subscribe((resultado) => {
        this.criteriosBusqueda = resultado;
      });

    this.busquedaAvanzada = selectedOption.getAttribute(
      'data-modelo-busqueda-avanzada'
    );
    this.modeloBusquedaAvanzada = selectedOption.getAttribute(
      'data-modelo-busqueda-avanzada'
    );
    this.inputValor1.nativeElement.value = '';
    this.inputValor1.nativeElement.focus();
    this.inputCritero.nativeElement.value = '';
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
    this.initFormulularioModal();
    let posicion: keyof typeof mapeo = this.modeloBusquedaAvanzada;
    this.propiedadBusquedaAvanzada = mapeo[posicion].filter(
      (propiedad) => propiedad.visibleFiltro === true
    );
    this.agregarNuevoFiltro();
    this.criteriosBusquedaModal = [];
    this.consultarLista([]);
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.changeDetectorRef.detectChanges();
  }

  consultarLista(listaFiltros: any) {
    this.httpService
      .post<{
        cantidad_registros: number;
        registros: any[];
        propiedades: any[];
      }>('general/funcionalidad/lista-buscar/', {
        modelo: this.modeloBusquedaAvanzada,
        filtros: listaFiltros,
      })
      .subscribe((respuesta) => {
        this.arrRegistros = respuesta.registros;

        this.changeDetectorRef.detectChanges();
      });
  }

  seleccionar(item: any) {
    this.modalService.dismissAll();
    this.filtroCampoValor1 = Object.values(item)[0];
    this.filtroCampoNombreFk = Object.values(item)[2];
    this.dataValor1.emit(Object.values(item)[0]);
  }

  actualizarCampoValor1(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.dataValor1.emit(target.value);
  }

  initFormulularioModal() {
    this.formularioFiltrosModal = this.formBuilder.group({
      filtros: this.formBuilder.array([]),
    });
  }

  get filtros() {
    return this.formularioFiltrosModal.get('filtros') as FormArray;
  }

  agregarNuevoFiltro() {
    this.filtros.push(
      this.formBuilder.group({
        propiedad: [''],
        operador: [''],
        valor1: ['', [Validators.required]],
        valor2: [''],
      })
    );
  }

  eliminarFiltro(index: number) {
    if (this.filtros.length > 1) {
      this.filtros.removeAt(index);
    }
  }

  limpiarFormulario() {
    this.formularioFiltrosModal.reset();
    this.filtros.clear();
    this.agregarNuevoFiltro();
    this.criteriosBusquedaModal = [];
    this.consultarLista([]);
  }

  propiedadSeleccionadaModal(event: any, index: number): void {
    this.filtroCampoValor1 = '';
    this.filtroTipoModal[index] = event.target.value;
    const selectedOption = event.target.selectedOptions[0];
    this.store
      .select(obtenerCriteriosFiltro(event.target.value))
      .subscribe((resultado) => {
        this.criteriosBusquedaModal[index] = resultado;
        resultado.find((item) => {
          if (item.defecto) {
            const filtroPorActualizar = this.filtros.controls[
              index
            ] as FormGroup;
            filtroPorActualizar.patchValue({
              propiedad: selectedOption.getAttribute('data-value'),
              operador: item.valor,
            });
          }
        });
      });
    let inputValor1Modal: HTMLInputElement | null = document.querySelector(
      '#inputValor1Modal' + index
    );
    inputValor1Modal!.focus();
  }

  criterioSeleccionadoModal(event: any, index: number) {
    const selectedOption = event.target.selectedOptions[0];
    const filtroPorActualizar = this.filtros.controls[index] as FormGroup;
    filtroPorActualizar.patchValue({
      operador: selectedOption.value,
    });
  }

  aplicarFiltro() {
    const filtros = this.formularioFiltrosModal.value['filtros'];
    const listaFiltros: any[] = [];
    let hayFiltrosSinValores = false;
    let emitirValores = true;
    filtros.forEach((filtro: any) => {
      if (filtro.propiedad !== '') {
        if (filtro.valor1 === '') {
          hayFiltrosSinValores = true;
        } else {
          const nuevoFiltro = {
            ...filtro,
            ...{
              propiedad:
                filtro.propiedad + filtro.operador !== null
                  ? filtro.propiedad + filtro.operador
                  : '',
            },
          };
          listaFiltros.push(nuevoFiltro);
        }
      } else {
        emitirValores = false;
      }
    });
    if (hayFiltrosSinValores === false) {
      this.consultarLista(listaFiltros);
    } else {
      this.alertaService.mensajeError(
        'Error en formulario filtros',
        'contiene campos vacios'
      );
    }
  }
}
