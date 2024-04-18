import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
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
  Validators,
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
  modelo: any = this.modelo;
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
  nombreFiltro = '';

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    // this.activatedRoute.queryParams.subscribe((parametro) => {
    //   this.nombreFiltro =
    //     `${parametro.modulo}_${parametro.modelo}_${parametro.tipo}_filtros`.toLocaleLowerCase();
    //   if (localStorage.getItem(this.nombreFiltro) !== null) {
    //     this.filtrosAplicados = JSON.parse(
    //       localStorage.getItem(this.nombreFiltro)!
    //     );
    //     this.formularioItem.reset();
    //     this.filtros.clear();
    //     this.filtrosAplicados.map((propiedad) => {
    //       this.filtros.push(this.crearControlFiltros(propiedad));
    //     });
    //   } else {
    //     this.formularioItem.reset();
    //     this.filtros.clear();
    //     this.filtrosAplicados = [{
    //       propiedad: '',
    //       operador: '',
    //       valor1: '',
    //       valor2: '',
    //       visualizarBtnAgregarFiltro: true,
    //     }]
    //     this.filtros.push(this.crearControlFiltros(null));
    //   }
    //   this.changeDetectorRef.detectChanges();
    // });
  }

  initForm() {
    this.formularioItem = this.formBuilder.group({
      filtros: this.formBuilder.array([]),
    });
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
    return this.formularioItem.get('filtros') as FormArray;
  }

  private crearControlFiltros(propiedades: any | null) {
    let valor1 = '';
    let valor2 = '';
    let propiedad = '';
    let operador = '';
    let tipo = '';
    if (propiedades) {
      valor1 = propiedades.valor1;
      valor2 = propiedades.valor2;
      propiedad = propiedades.propiedad;
      operador = propiedades.operador;
      tipo = propiedades.tipo;
    }
    return this.formBuilder.group({
      propiedad: [propiedad],
      operador: [operador],
      valor1: [valor1, [Validators.required]],
      valor2: [valor2],
      tipo: [tipo],
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
      if (filtro.propiedad === '' || filtro.valor1 === '') {
        hayFiltrosSinValores = true;
      } else {
        const nuevoFiltro = {
          ...filtro,
          id: this.generarIdUnico(),
          ...{
            campo:
              filtro.propiedad + filtro.operador !== null
                ? filtro.propiedad + filtro.operador
                : '',
          },
        };
        listaFiltros.push(nuevoFiltro);
      }
    });

    if (hayFiltrosSinValores) {
      hayFiltrosSinValores = false;

      this.alertaService.mensajeError(
        'Error en formulario filtros',
        'contiene campos vacios'
      );
    } else {
      this.listaFiltros = listaFiltros;

      localStorage.setItem(
        this.nombreFiltro,
        JSON.stringify(this.listaFiltros)
      );

      this.emitirFiltros.emit(this.listaFiltros);
    }
  }

  actualizarPropiedad(propiedad: any, index: number) {
    const filtroPorActualizar = this.filtros.controls[index] as FormGroup;
    filtroPorActualizar.patchValue({
      propiedad: propiedad.campo,
      tipo: propiedad.tipo,
    });
    if (propiedad.tipo === 'Booleano') {
      filtroPorActualizar.patchValue({
        valor1: null,
      });
    }
  }

  actualizarOperador(operador: string, index: number) {
    const filtroPorActualizar = this.filtros.controls[index] as FormGroup;
    filtroPorActualizar.patchValue({ operador });
  }

  limpiarFormulario() {
    localStorage.removeItem(this.nombreFiltro);
    this.formularioItem.reset();
    this.filtros.clear();
    this.agregarNuevoFiltro();
    this.emitirFiltros.emit([]);
  }

  generarIdUnico() {
    const timestamp = Date.now(); // Obtiene la marca de tiempo actual en milisegundos
    const numeroAleatorio = Math.floor(Math.random() * 10000); // Genera un número aleatorio entre 0 y 9999
    const idUnico = `${timestamp}-${numeroAleatorio}`; // Combina la marca de tiempo y el número aleatorio
    return idUnico;
  }
}
