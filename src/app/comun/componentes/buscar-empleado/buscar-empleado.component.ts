import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, OutputEmitterRef, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { AutocompletarRegistros, RegistroAutocompletarContacto, RegistroAutocompletarHumContrato } from '@interfaces/comunes/autocompletar';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, finalize, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-buscar-empleado',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbDropdownModule,     TranslateModule,  ],
  templateUrl: './buscar-empleado.component.html',
  styleUrl: './buscar-empleado.component.scss',
})
export class BuscarEmpleadoComponent extends General implements OnInit , OnChanges  {
  formularioEmpleado: FormGroup;
  arrEmpleados: any[] = [];
  public cargandoEmpleados$ = new BehaviorSubject<boolean>(false);
  public busquedaEmpleado = new Subject<string>();
  @Input() informacionEmpleado = {
    identificacion: '',
    empleado: '',
    empleado_nombre: ''
  };
  @Input() requerido: boolean = false;
  @Input() formularioError: any = false;
  @Output() emitirEmpleado: EventEmitter<any> = new EventEmitter();


  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
  ) {
    super();
    this._inicializarBusqueda();
  }

  ngOnInit(): void {
    this.iniciarFormulario();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.informacionEmpleado) {
      if (changes.informacionEmpleado.currentValue) {
        this.iniciarFormulario()
      }
    }
    if(changes.formularioError){
      if(changes.formularioError.currentValue){
        this.formularioEmpleado.markAllAsTouched()
        this.changeDetectorRef.detectChanges()
      }
    }
  }

  private _inicializarBusqueda() {
    this.busquedaEmpleado
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap((valor: string) => {
          return this.consultarEmpleadosPorNombre(valor);
        })
      )
      .subscribe();
  }

  iniciarFormulario() {
    this.formularioEmpleado = this.formBuilder.group({
      identificacion: [this.informacionEmpleado.identificacion, Validators.required],
      empleado: [this.informacionEmpleado.empleado, Validators.compose([Validators.required])],
      empleado_nombre: [this.informacionEmpleado.empleado_nombre, Validators.required],
    });
  }

  validarCampoEmpleado() {
    this.formularioEmpleado.get('empleado')?.markAsTouched();
  }

  consultarEmpleados(valor: string, propiedad: string) {
    this.cargandoEmpleados$.next(true);
    let filtros = {
      operador: '',
      propiedad,
      valor1: valor,
      valor2: '',
    };

    let arrFiltros = {
      filtros: [filtros],
      limite: 1000,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'GenContacto',
      serializador: 'ListaAutocompletar',
    };

    this.httpService
      .post<AutocompletarRegistros<RegistroAutocompletarContacto>>(
        'general/funcionalidad/lista/',
        arrFiltros
      )
      .pipe(
        tap((respuesta) => {
          this.arrEmpleados = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        }),
        finalize(() => this.cargandoEmpleados$.next(false))
      )
      .subscribe();
  }

  consultarEmpleadosPorNombre(valor: string) {

    let filtros = {};

    if (!valor.length) {
      filtros = {
        ...filtros,
        operador: '',
        propiedad: 'nombre_corto__icontains',
        valor1: `${valor}`,
        valor2: '',
      };
    } else if (isNaN(Number(valor))) {
      filtros = {
        ...filtros,
        operador: '',
        propiedad: 'nombre_corto__icontains',
        valor1: `${valor}`,
        valor2: '',
      };
    } else {
      filtros = {
        ...filtros,
        operador: '',
        propiedad: 'numero_identificacion__icontains',
        valor1: `${Number(valor)}`,
        valor2: '',
      };
    }

    let arrFiltros = {
      filtros: [filtros],
      limite: 1000,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'GenContacto',
      serializador: 'ListaAutocompletar',
    };

    return this.httpService
      .post<AutocompletarRegistros<RegistroAutocompletarContacto>>(
        'general/funcionalidad/lista/',
        arrFiltros
      )
      .pipe(
        tap((respuesta) => {
          this.arrEmpleados = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        }),
        finalize(() => this.cargandoEmpleados$.next(false))
      );
  }


  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioEmpleado?.markAsDirty();
    this.formularioEmpleado?.markAsTouched();
    if (campo === 'contrato') {
      this.formularioEmpleado
        .get(campo)
        ?.setValue(dato.contrato_id);
      this.formularioEmpleado
        .get('contrato_nombre')
        ?.setValue(dato.contrato_contacto_nombre_corto);
      this.formularioEmpleado
        .get('identificacion')
        ?.setValue(dato.numero_identificacion);
      this.emitirEmpleado.emit(dato)
    }
    this.changeDetectorRef.detectChanges();
  }

  onSearch(event: any) {
    const searchTerm = event.target.value;
    if (!searchTerm) {
      this.reiniciarCamposBusqueda();
    }
    this.busquedaEmpleado.next(searchTerm);
  }

  reiniciarCamposBusqueda() {
    this.formularioEmpleado.get('identificacion')?.setValue('');
    this.formularioEmpleado.get('contrato_nombre')?.setValue('');
    this.formularioEmpleado.get('contrato')?.setValue('');
  }

}
