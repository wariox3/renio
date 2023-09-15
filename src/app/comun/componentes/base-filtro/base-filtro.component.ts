import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { BaseFiltroFormularioComponent } from '../base-filtro-formulario/base-filtro-formulario.component';
import { FiltrosAplicados, Listafiltros } from '@interfaces/comunes/filtros';
import { General } from '@comun/clases/general';

@Component({
  selector: 'app-base-filtro',
  templateUrl: './base-filtro.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    TranslationModule,
    FormsModule,
    ReactiveFormsModule,
    BaseFiltroFormularioComponent,
  ],
})
export class BaseFiltroComponent extends General implements OnInit {
  formularioItem: FormGroup;
  listaFiltros: Listafiltros[] = [];
  filtrosAplicados: FiltrosAplicados[] = [
    {
      propiedad: '',
      operador: '',
      valor_1: '',
      valor_2: '',
      visualizarBtnAgregarFiltro: true,
    },
  ];
  @Input() propiedades: Listafiltros[];
  @Output() emitirFiltros: EventEmitter<any> = new EventEmitter();
  nombreFiltro = `${this.modulo}_${this.modelo}_${this.tipo}`

  constructor(private formBuilder: FormBuilder) {
    super()
  }

  ngOnInit(): void {
    this.initForm();
    this.cargarCamposAlFormulario();
  }

  initForm() {
    this.formularioItem = this.formBuilder.group({
      filtros: this.formBuilder.array([
      ]),
    });
  }

  esCampoInvalido(index: number, campo: string) {
    const filtro = this.filtros.at(index);

    if (filtro) {
      const campoControl = filtro.get(campo);

      if (campoControl) {
        return campoControl.invalid && (campoControl.touched || campoControl.dirty);
      }
    }

    return false;
  }


  get filtros() {
    return this.formularioItem.get('filtros') as FormArray;
  }

  private crearControlFiltros(propiedades: any | null) {
    let valor_1 = '';
    let valor_2 = '';
    let propiedad = '';
    let operador = '';
    if (propiedades) {
      valor_1 = propiedades.valor_1;
      valor_2 = propiedades.valor_2;
      propiedad = propiedades.propiedad;
      operador = propiedades.operador;
    }

    return this.formBuilder.group({
      propiedad: [propiedad],
      operador: [operador],
      valor_1: [valor_1, [Validators.required]],
      valor_2: [valor_2],
    });
  }

  agregarNuevoFiltro() {
    this.filtros.push(
      this.formBuilder.group({
        propiedad: [''],
        operador: [''],
        valor_1: ['', [Validators.required]],
        valor_2: [''],
      })
    );
  }

  cargarCamposAlFormulario() {
    if (localStorage.getItem(this.nombreFiltro)) {
      this.filtrosAplicados = JSON.parse(
        localStorage.getItem(this.nombreFiltro)!
      );
      this.filtrosAplicados.map((propiedad) => {
        this.filtros.push(this.crearControlFiltros(propiedad));
      });
    } else {
      this.filtros.push(this.crearControlFiltros(null));
    }
  }

  eliminarFiltro(index: number) {
    if (this.filtros.length > 1) {
      this.filtros.removeAt(index);
    }
  }

  eliminarFiltroLista(index: string) {
    this.listaFiltros = this.listaFiltros.filter(
      (filtro: any) => filtro.id !== index
    );
  }

  aplicarFiltro() {
    const filtros = this.formularioItem.value['filtros'];
    const listaFiltros: any[] = [];
    let hayFiltrosSinValores = false;

    filtros.forEach((filtro: any) => {

      if (
        filtro.propiedad === '' &&
        filtro.operador === '' &&
        filtro.valor_1 === ''
      ) {
        hayFiltrosSinValores = true;
        return;
      }

      const nuevoFiltro = {
        ...filtro,
        id: this.generarIdUnico(),
        ...{
          propiedad:
            filtro.propiedad + filtro.operador !== null
              ? filtro.propiedad + filtro.operador
              : '',
        },
      };

      listaFiltros.push(nuevoFiltro);
    });

    if (hayFiltrosSinValores) {
      return;
    }

    this.listaFiltros = listaFiltros;

    localStorage.setItem(
      this.nombreFiltro,
      JSON.stringify(this.listaFiltros)
    );

    this.emitirFiltros.emit(this.listaFiltros);
  }

  actualizarPropiedad(propiedad: string, index: number) {
    const filtroPorActualizar = this.filtros.controls[index] as FormGroup;
    filtroPorActualizar.patchValue({ propiedad });
  }

  actualizarOperador(operador: string, index: number) {
    const filtroPorActualizar = this.filtros.controls[index] as FormGroup;
    filtroPorActualizar.patchValue({ operador });
  }

  limpiarFormulario() {
    this.formularioItem.reset();
    localStorage.removeItem(document.location.pathname);
    this.filtros.clear();
    this.agregarNuevoFiltro();
  }

  generarIdUnico() {
    const timestamp = Date.now(); // Obtiene la marca de tiempo actual en milisegundos
    const numeroAleatorio = Math.floor(Math.random() * 10000); // Genera un número aleatorio entre 0 y 9999
    const idUnico = `${timestamp}-${numeroAleatorio}`; // Combina la marca de tiempo y el número aleatorio
    return idUnico;
  }
}
