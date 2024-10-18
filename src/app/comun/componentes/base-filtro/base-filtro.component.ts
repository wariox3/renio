import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FiltrosAplicados, Listafiltros } from '@interfaces/comunes/filtros';
import { General } from '@comun/clases/general';
import { obtenerMenuDataMapeoCamposVisibleFiltros } from '@redux/selectors/menu.selectors';
import { obtenerCriteriosFiltro } from '@redux/selectors/criteriosFIltro.selectors';
import { SoloNumerosDirective } from '@comun/Directive/solo-numeros.directive';
import { NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { mapeo } from '@comun/extra/mapeoEntidades/buscarAvanzados';
import { HttpService } from '@comun/services/http.service';
import { KeysPipe } from '@pipe/keys.pipe';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-base-filtro',
  templateUrl: './base-filtro.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    SoloNumerosDirective,
    KeysPipe,
    NgbTooltipModule,
  ],
  styleUrls: ['./base-filtro.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition(':enter, :leave', [animate(600)]),
    ]),
  ],
})
export class BaseFiltroComponent extends General implements OnInit {
  formularioFiltros: FormGroup;
  formularioFiltrosModal: FormGroup;
  listaFiltros: Listafiltros[] = [];
  modelo: any = this.modelo;
  tituloModal: string;
  arrPropiedades: any = [];
  arrPropiedadBusquedaAvanzada: any = [];
  arrRegistroBusquedaAvanzada: any = [];
  indexBusquedaAvanzada: number;
  filtrosAplicados: FiltrosAplicados[] = [
    {
      propiedad: '',
      operador: '',
      valor1: '',
      valor2: '',
      visualizarBtnAgregarFiltro: true,
    },
  ];
  criteriosBusqueda: {
    valor: string | number | boolean;
    texto: string;
    defecto?: boolean;
  }[][] = [];
  criteriosBusquedaModal: {
    valor: string | number | boolean;
    texto: string;
    defecto?: boolean;
  }[][] = [];
  @Input() modeloPersonalizado: string = '';
  @Input() propiedades: Listafiltros[];
  @Input() persistirFiltros: boolean = true;
  @Output() emitirFiltros: EventEmitter<any> = new EventEmitter();
  nombreFiltro = ``;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private httpService: HttpService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.construirPropiedades();
    this.activatedRoute.queryParams.subscribe((parametro) => {
      if (this.modeloPersonalizado !== '') {
        this.tipo = this.modeloPersonalizado;
      } else {
        this.tipo = parametro.itemTipo!;
      }
      let tipo = window.location.pathname.split('/')[1];
      this.nombreFiltro = `${tipo}_${parametro.itemNombre?.toLowerCase()}`;
      if (localStorage.getItem(this.nombreFiltro) !== null) {
        this.filtrosAplicados = JSON.parse(
          localStorage.getItem(this.nombreFiltro)!
        );
        this.formularioFiltros.reset();
        this.filtros.clear();
        this.filtrosAplicados.map((propiedad, index) => {
          this.filtros.push(this.crearControlFiltros(propiedad, index));
        });
      } else {
        this.formularioFiltros.reset();
        this.filtros.clear();
        this.filtrosAplicados = [
          {
            propiedad: '',
            operador: '',
            valor1: '',
            valor2: '',
            visualizarBtnAgregarFiltro: true,
          },
        ];
        this.filtros.push(this.crearControlFiltros(null, 0));
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  initForm() {
    this.formularioFiltros = this.formBuilder.group({
      filtros: this.formBuilder.array([]),
    });
  }

  initFormulularioModal() {
    this.formularioFiltrosModal = this.formBuilder.group({
      filtros: this.formBuilder.array([]),
    });
  }

  construirPropiedades() {
    this.store
      .select(obtenerMenuDataMapeoCamposVisibleFiltros)
      .subscribe((campos) => (this.arrPropiedades = campos));
    this.changeDetectorRef.detectChanges();
  }

  esCampoInvalido(index: number, campo: string) {
    const filtro = this.filtros.at(index);
    if (filtro) {
      const campoControl = filtro.get(campo);
      if (campoControl) {
        return (
          campoControl.invalid && (campoControl.touched || campoControl.dirty)
        );
      }
    }
    return false;
  }

  get filtros() {
    return this.formularioFiltros.get('filtros') as FormArray;
  }

  get filtrosModal() {
    return this.formularioFiltrosModal.get('filtros') as FormArray;
  }

  private crearControlFiltros(propiedades: any | null, index: number) {
    let valor1 = '';
    let valor2 = '';
    let propiedad = '';
    let operador = '';
    let tipo = '';
    let busquedaAvanzada = 'false';
    let modeloBusquedaAvanzada = '';
    if (propiedades) {
      valor1 = propiedades.valor1;
      valor2 = propiedades.valor2;
      propiedad = propiedades.campo;
      operador = propiedades.operador;
      tipo = propiedades.tipo;
      this.store
        .select(obtenerCriteriosFiltro(propiedades.tipo))
        .subscribe((respuesta) => {
          this.criteriosBusqueda[index] = respuesta;
        });
    }
    return this.formBuilder.group({
      propiedad: [propiedad],
      operador: [operador],
      valor1: [valor1, [Validators.required]],
      valor2: [valor2],
      tipo: [tipo],
      busquedaAvanzada: [busquedaAvanzada],
      modeloBusquedaAvanzada: [modeloBusquedaAvanzada],
    });
  }

  agregarNuevoFiltro() {
    this.filtros.push(
      this.formBuilder.group({
        propiedad: [''],
        operador: [''],
        valor1: ['', [Validators.required]],
        valor2: [''],
        tipo: [''],
        busquedaAvanzada: ['false'],
        modeloBusquedaAvanzada: [''],
      })
    );
  }

  agregarNuevoFiltroModal() {
    this.filtrosModal.push(
      this.formBuilder.group({
        propiedad: [''],
        operador: [''],
        valor1: ['', [Validators.required]],
        valor2: [''],
      })
    );
    this.changeDetectorRef.detectChanges();
  }

  cargarCamposAlFormulario() {
    if (localStorage.getItem(this.nombreFiltro)) {
      this.filtrosAplicados = JSON.parse(
        localStorage.getItem(this.nombreFiltro)!
      );
      this.filtrosAplicados.map((propiedad, index) => {
        this.filtros.push(this.crearControlFiltros(propiedad, index));
      });
    } else {
      this.filtros.push(this.crearControlFiltros(null, 0));
    }
  }

  eliminarFiltro(index: number) {
    if (this.filtros.length > 1) {
      this.filtros.removeAt(index);
    }
  }

  eliminarFiltroModal(index: number) {
    if (this.filtrosModal.length > 1) {
      this.filtrosModal.removeAt(index);
    }
  }

  aplicarFiltro() {
    const filtros = this.formularioFiltros.value['filtros'];
    const listaFiltros: any[] = [];
    let hayFiltrosSinValores = false;
    let emitirValores = true;
    filtros.forEach((filtro: any) => {
      if (filtro.propiedad !== '') {
        if (filtro.valor1 === '') {
          hayFiltrosSinValores = true;
        } else {
          let nuevoFiltro = {};
          if (filtro.tipo === 'Booleano') {
            nuevoFiltro = {
              ...filtro,
              ...{
                propiedad: `${filtro.propiedad}`,
                campo: filtro.propiedad,
                valor1: filtro.operador === 'true' ? true : false,
              },
            };
          } else {
            let propiedad = filtro.propiedad;
            if (filtro.operador !== 'igual') {
              propiedad = `${filtro.propiedad}${filtro.operador}`;
            }
            nuevoFiltro = {
              ...filtro,
              ...{
                propiedad,
                campo: filtro.propiedad,
              },
            };
          }
          listaFiltros.push(nuevoFiltro);
        }
      } else {
        emitirValores = false;
      }
    });

    if (hayFiltrosSinValores === false) {
      this.listaFiltros = listaFiltros;
      if (this.persistirFiltros) {
        localStorage.setItem(
          this.nombreFiltro,
          JSON.stringify(this.listaFiltros)
        );
      }
      if (emitirValores) {
        this.emitirFiltros.emit(this.listaFiltros);
      }
    } else {
      this.alertaService.mensajeError(
        'Error en formulario filtros',
        'contiene campos vacios'
      );
    }
  }

  actualizarOperador(operador: string, index: number) {
    const filtroPorActualizar = this.filtros.controls[index] as FormGroup;
    filtroPorActualizar.patchValue({ operador: operador });
  }

  actualizarValor1(valor1: string, index: number) {
    const filtroPorActualizar = this.filtros.controls[index] as FormGroup;
    filtroPorActualizar.patchValue({ valor1 });
  }

  limpiarFormulario() {
    localStorage.removeItem(this.nombreFiltro);
    this.formularioFiltros.reset();
    this.filtros.clear();
    this.agregarNuevoFiltro();
    this.emitirFiltros.emit([]);
  }

  limpiarFormularioModal(modal: string) {
    this.formularioFiltrosModal.reset();
    this.filtrosModal.clear();
    this.agregarNuevoFiltroModal();
    this.criteriosBusquedaModal = [];
    this.consultarLista([], modal);
  }

  seleccionarPropiedad(evento: Event, index: number) {
    const propiedad = evento.target as HTMLSelectElement;
    const propiedadSeleccionada: any = propiedad.selectedOptions[0];

    if (propiedadSeleccionada.getAttribute('data-tipo')) {
      this.store
        .select(
          obtenerCriteriosFiltro(
            propiedadSeleccionada.getAttribute('data-tipo')
          )
        )
        .subscribe((resultado) => {
          this.criteriosBusqueda[index] = resultado;
          const filtroPorActualizar = this.filtros.controls[index] as FormGroup;
          resultado.find((item) => {
            if (item.defecto) {
              filtroPorActualizar.patchValue({
                tipo: propiedadSeleccionada.getAttribute('data-tipo'),
                busquedaAvanzada: propiedadSeleccionada.getAttribute(
                  'data-busqueda-avanzada'
                ),
                modeloBusquedaAvanzada: propiedadSeleccionada.getAttribute(
                  'data-modelo-busqueda-avanzada'
                ),
                operador: item.valor,
              });
            }
          });
          if (propiedadSeleccionada.getAttribute('data-tipo') === 'Booleano') {
            filtroPorActualizar.patchValue({
              tipo: propiedadSeleccionada.getAttribute('data-tipo'),
              valor1: null,
              operador: '',
            });
          }
          let inputValor1Modal: HTMLInputElement | null =
            document.querySelector('#inputValor1' + index);
          inputValor1Modal!.focus();
        });
    }
  }

  abirModal(content: any, index: number) {
    this.indexBusquedaAvanzada = index;
    const filtro = this.filtros.controls[index] as FormGroup;
    this.tituloModal = filtro.get('modeloBusquedaAvanzada')?.value;
    this.initFormulularioModal();
    let posicion: keyof typeof mapeo = this.tituloModal;
    this.arrPropiedadBusquedaAvanzada = mapeo[posicion].filter(
      (propiedad) => propiedad.visibleFiltro === true
    );
    this.agregarNuevoFiltroModal();
    this.criteriosBusquedaModal = [];
    this.consultarLista([], this.tituloModal);
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.changeDetectorRef.detectChanges();
  }

  cerrarModal(item: any) {
    const filtro = this.filtros.controls[
      this.indexBusquedaAvanzada
    ] as FormGroup;
    filtro.patchValue({
      valor1: Object.values(item)[0],
    });
    this.modalService.dismissAll();
  }

  consultarLista(listaFiltros: any, modelo: string) {
    this.httpService
      .post<{
        cantidad_registros: number;
        registros: any[];
        propiedades: any[];
      }>('general/funcionalidad/lista/', {
        modelo,
        filtros: listaFiltros,
        serializador: 'ListaBuscar'
      })
      .subscribe((respuesta) => {
        this.arrRegistroBusquedaAvanzada = respuesta.registros;
        this.changeDetectorRef.detectChanges();
      });
  }

  propiedadSeleccionadaModal(evento: Event, index: number) {
    const propiedad = evento.target as HTMLSelectElement;
    const propiedadSeleccionada: any = propiedad.selectedOptions[0];

    if (propiedadSeleccionada.getAttribute('data-tipo')) {
      this.store
        .select(
          obtenerCriteriosFiltro(
            propiedadSeleccionada.getAttribute('data-tipo')
          )
        )
        .subscribe((resultado) => {
          this.criteriosBusquedaModal[index] = resultado;
          const filtroPorActualizar = this.filtrosModal.controls[index] as FormGroup;
          resultado.find((item) => {
            if (item.defecto) {
              filtroPorActualizar.patchValue({
                tipo: propiedadSeleccionada.getAttribute('data-tipo'),
                busquedaAvanzada: propiedadSeleccionada.getAttribute(
                  'data-busqueda-avanzada'
                ),
                modeloBusquedaAvanzada: propiedadSeleccionada.getAttribute(
                  'data-modelo-busqueda-avanzada'
                ),
                operador: item.valor,
              });
            }
          });
          if (propiedadSeleccionada.getAttribute('data-tipo') === 'Booleano') {
            filtroPorActualizar.patchValue({
              tipo: propiedadSeleccionada.getAttribute('data-tipo'),
              valor1: null,
              operador: '',
            });
          }
          let inputValor1Modal: HTMLInputElement | null =
            document.querySelector('#inputValor1Modal' + index);
            inputValor1Modal!.focus();
        });
    }
  }

  aplicarFiltroModal(modal: string) {
    const filtros = this.formularioFiltrosModal.value['filtros'];
    const listaFiltros: any[] = [];
    let hayFiltrosSinValores = false;
    let emitirValores = true;
    filtros.forEach((filtro: any) => {
      if (filtro.propiedad !== '') {
        if (filtro.valor1 === '') {
          hayFiltrosSinValores = true;
        } else {
          let nuevoFiltro = {};
          if (filtro.tipo === 'Booleano') {
            nuevoFiltro = {
              ...filtro,
              ...{
                propiedad: `${filtro.propiedad}`,
                campo: filtro.propiedad,
                valor1: filtro.operador === 'true' ? true : false,
              },
            };
          } else {
            let propiedad = filtro.propiedad;
            if (filtro.operador !== 'igual') {
              propiedad = `${filtro.propiedad}${filtro.operador}`;
            }
            nuevoFiltro = {
              ...filtro,
              ...{
                propiedad,
                campo: filtro.propiedad,
              },
            };
          }
          listaFiltros.push(nuevoFiltro);
        }
      } else {
        emitirValores = false;
      }
    });
    if (hayFiltrosSinValores === false) {
      this.consultarLista(listaFiltros, modal);
    } else {
      this.alertaService.mensajeError(
        'Error en formulario filtros',
        'contiene campos vacios'
      );
    }
  }

  obtenerValorFiltro(propiedad:any){
    let valorFiltro = '';
    if(propiedad.esFk){
      valorFiltro =  propiedad.modeloFk.toLocaleLowerCase().substring(3) + '_id'
    } else {
      if(propiedad.nombreFiltroRelacion){
        valorFiltro =  propiedad.nombreFiltroRelacion
      } else {
        valorFiltro =  propiedad.nombre
      }
    }
    return valorFiltro.toLocaleLowerCase()
  }
}
