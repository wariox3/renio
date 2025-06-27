import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarGenContacto } from '@interfaces/comunes/autocompletar/general/gen-contacto.interface';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  finalize,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { ParametrosApi } from 'src/app/core/interfaces/api.interface';

@Component({
  selector: 'app-buscar-empleado',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    TranslateModule,
  ],
  templateUrl: './buscar-empleado.component.html',
  styleUrl: './buscar-empleado.component.scss',
})
export class BuscarEmpleadoComponent
  extends General
  implements OnInit, OnChanges
{
  formularioEmpleado: FormGroup;
  arrEmpleados: RegistroAutocompletarGenContacto[] = [];
  public cargandoEmpleados$ = new BehaviorSubject<boolean>(false);
  public busquedaEmpleado = new Subject<string>();
  filtrosPermanentes: ParametrosApi = {
    empleado: true,
  };
  @Input() informacionEmpleado = {
    identificacion: '',
    empleado: '',
    empleado_nombre: '',
  };
  @Input() requerido: boolean = false;
  @Input() formularioError: any = false;
  @Output() emitirEmpleado: EventEmitter<any> = new EventEmitter();

  private readonly _generalService = inject(GeneralService);

  constructor(private formBuilder: FormBuilder) {
    super();
    this._inicializarBusqueda();
  }

  ngOnInit(): void {
    this.iniciarFormulario();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.informacionEmpleado) {
      if (changes.informacionEmpleado.currentValue) {
        this.iniciarFormulario();
      }
    }
    if (changes.formularioError) {
      if (changes.formularioError.currentValue) {
        this.formularioEmpleado.markAllAsTouched();
        this.changeDetectorRef.detectChanges();
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
        }),
      )
      .subscribe();
  }

  iniciarFormulario() {
    this.formularioEmpleado = this.formBuilder.group({
      identificacion: [
        this.informacionEmpleado.identificacion,
        Validators.required,
      ],
      empleado: [
        this.informacionEmpleado.empleado,
        Validators.compose([Validators.required]),
      ],
      empleado_nombre: [
        this.informacionEmpleado.empleado_nombre,
        Validators.required,
      ],
    });
  }

  validarCampoEmpleado() {
    this.formularioEmpleado.get('empleado')?.markAsTouched();
  }

  consultarEmpleados(valor: string, propiedad: string) {
    this.cargandoEmpleados$.next(true);
    let parametros: ParametrosApi = {
      ...this.filtrosPermanentes,
      [propiedad]: valor,
    };

    this._generalService
      .consultaApi<RegistroAutocompletarGenContacto[]>(
        'general/contacto/seleccionar/',
        parametros,
      )
      .pipe(
        tap((respuesta) => {
          this.arrEmpleados = respuesta;
          this.changeDetectorRef.detectChanges();
        }),
        finalize(() => this.cargandoEmpleados$.next(false)),
      )
      .subscribe();
  }

  consultarEmpleadosPorNombre(valor: string) {
    let parametros: ParametrosApi = {};

    if (!valor.length) {
      parametros = {
        ...this.filtrosPermanentes,
        nombre_corto__icontains: `${valor}`,
      };
    } else if (isNaN(Number(valor))) {
      parametros = {
        ...this.filtrosPermanentes,
        nombre_corto__icontains: `${valor}`,
      };
    } else {
      parametros = {
        ...this.filtrosPermanentes,
        numero_identificacion__icontains: `${Number(valor)}`,
      };
    }

    return this._generalService
      .consultaApi<RegistroAutocompletarGenContacto[]>(
        'general/contacto/seleccionar/',
        parametros,
      )
      .pipe(
        tap((respuesta) => {
          this.arrEmpleados = respuesta;
          this.changeDetectorRef.detectChanges();
        }),
        finalize(() => this.cargandoEmpleados$.next(false)),
      );
  }

  modificarCampoFormulario(campo: string, dato: RegistroAutocompletarGenContacto) {
    this.formularioEmpleado?.markAsDirty();
    this.formularioEmpleado?.markAsTouched();
    if (campo === 'contrato') {
      this.formularioEmpleado.get(campo)?.setValue(dato.id);
      this.formularioEmpleado
        .get('contrato_nombre')
        ?.setValue(dato.nombre_corto);
      this.formularioEmpleado
        .get('identificacion')
        ?.setValue(dato.numero_identificacion);
      this.emitirEmpleado.emit(dato);
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
