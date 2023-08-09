import {
  Component,
  TemplateRef,
  ViewChild,
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
} from '@angular/forms';
import { BaseFiltroFormularioComponent } from '../base-filtro-formulario/base-filtro-formulario.component';
import { FiltrosAplicados, Listafiltros } from '@interfaces/comunes/filtros';

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
export class BaseFiltroComponent implements OnInit {
  formularioItem: FormGroup;
  listaFiltros: Listafiltros[] = [];
  filtrosAplicados: FiltrosAplicados[] = [
    {
      propiedad: '',
      operador: '',
      valor1: '',
      valor2: '',
      visualizarBtnAgregarFiltro: true,
    },
  ];
  @Input() propiedades: Listafiltros[];
  @Output() emitirFiltros: EventEmitter<any> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarCamposAlFormulario();
  }

  initForm() {
    this.formularioItem = this.formBuilder.group({
      filtros: this.formBuilder.array([]),
    });
  }

  get filtros() {
    return this.formularioItem.get('filtros') as FormArray;
  }

  private crearControlFiltros(propiedades: any | null) {
    let valor1 = '';
    let valor2 = '';
    let propiedad = '';
    let operador = '';
    if (propiedades) {
      valor1 = propiedades.valor1;
      valor2 = propiedades.valor2;
      propiedad = propiedades.propiedad;
      operador = propiedades.operador;
    }

    return this.formBuilder.group({
      propiedad: [propiedad],
      operador: [operador],
      valor1: [valor1],
      valor2: [valor2],
    });
  }

  agregarNuevoFiltro() {
    this.filtros.push(
      this.formBuilder.group({
        propiedad: [''],
        operador: [''],
        valor1: [''],
        valor2: [''],
      })
    );
  }

  cargarCamposAlFormulario() {
    if (localStorage.getItem(document.location.pathname)) {
      this.filtrosAplicados = JSON.parse(
        localStorage.getItem(document.location.pathname)!
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
    console.log(index);

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
        filtro.valor1 === ''
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
      document.location.pathname,
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
