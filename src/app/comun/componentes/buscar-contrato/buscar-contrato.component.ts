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
import { RegistroAutocompletarHumContrato } from '@interfaces/comunes/autocompletar/humano/hum-contrato.interface';
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
  selector: 'app-buscar-contrato',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    TranslateModule,
  ],
  templateUrl: './buscar-contrato.component.html',
  styleUrl: './buscar-contrato.component.scss',
})
export class BuscarContratoComponent
  extends General
  implements OnInit, OnChanges
{
  formularioContrato: FormGroup;
  arrContratos: RegistroAutocompletarHumContrato[] = [];
  public cargandoEmpleados$ = new BehaviorSubject<boolean>(false);
  public busquedaContrato = new Subject<string>();
  @Input() informacionContrato = {
    identificacion: '',
    contrato: '',
    contrato_nombre: '',
  };
  @Input() requerido: boolean = false;
  @Input() formularioError: any = false;
  @Input() mostrarSoloActivos: boolean = false;
  @Input() mostrarToggleFiltro: boolean = true; // Permitir ocultar el toggle si no se necesita
  @Output() emitirContrato: EventEmitter<RegistroAutocompletarHumContrato> = new EventEmitter();
  @Output() emitirCambioFiltro: EventEmitter<boolean> = new EventEmitter();

  private readonly formBuilder = inject(FormBuilder);
  private readonly _generalService = inject(GeneralService);

  constructor() {
    super();
    this._inicializarBusqueda();
  }

  ngOnInit(): void {
    this.iniciarFormulario();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.informacionContrato) {
      if (changes.informacionContrato.currentValue) {
        this.iniciarFormulario();
      }
    }
    if (changes.formularioError) {
      if (changes.formularioError.currentValue) {
        this.formularioContrato.markAllAsTouched();
        this.changeDetectorRef.detectChanges();
      }
    }
  }

  private _inicializarBusqueda() {
    this.busquedaContrato
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap((valor: string) => {
          return this.consultarContratosPorNombre(valor);
        }),
      )
      .subscribe();
  }

  iniciarFormulario() {
    this.formularioContrato = this.formBuilder.group({
      identificacion: [
        this.informacionContrato.identificacion,
        Validators.required,
      ],
      contrato: [
        this.informacionContrato.contrato,
        Validators.compose([Validators.required]),
      ],
      contrato_nombre: [
        this.informacionContrato.contrato_nombre,
        Validators.required,
      ],
    });
  }

  validarCampoContrato() {
    this.formularioContrato.get('contrato')?.markAsTouched();
  }

  consultarContratos(valor: string, propiedad: string) {
    this.cargandoEmpleados$.next(true);
    
    let parametros: ParametrosApi = {
      [propiedad]: valor,
    };
    
    // Agregar filtro de contratos activos si está habilitado
    if (!this.mostrarSoloActivos) {
      parametros = {
        ...parametros,
        estado_terminado: 'False'
      };
    }
    
    this._generalService
      .consultaApi<RegistroAutocompletarHumContrato[]>(
        'humano/contrato/seleccionar/',
        parametros,
      )
      .pipe(
        tap((respuesta) => {
          this.arrContratos = respuesta;
          this.changeDetectorRef.detectChanges();
        }),
        finalize(() => this.cargandoEmpleados$.next(false)),
      )
      .subscribe();
  }

  consultarContratosPorNombre(valor: string) {
    let parametros: ParametrosApi = {};

    if (!valor.length) {
      parametros = {
        ...parametros,
        contacto__nombre_corto__icontains: `${valor}`,
      };
    } else if (isNaN(Number(valor))) {
      parametros = {
        ...parametros,
        contacto__nombre_corto__icontains: `${valor}`,
      };
    } else {
      parametros = {
        ...parametros,
        contacto__numero_identificacion__icontains: `${Number(valor)}`,
      };
    }

    // Agregar filtro de contratos activos si está habilitado
    if (!this.mostrarSoloActivos) {
      parametros = {
        ...parametros,
        estado_terminado: 'False'
      };
    }

    return this._generalService
      .consultaApi<
        RegistroAutocompletarHumContrato[]
      >('humano/contrato/seleccionar/', parametros)
      .pipe(
        tap((respuesta) => {
          this.arrContratos = respuesta;
          this.changeDetectorRef.detectChanges();
        }),
        finalize(() => this.cargandoEmpleados$.next(false)),
      );
  }

  modificarCampoFormulario(campo: string, dato: RegistroAutocompletarHumContrato) {
    this.formularioContrato?.markAsDirty();
    this.formularioContrato?.markAsTouched();
    if (campo === 'contrato') {
      this.formularioContrato.get(campo)?.setValue(dato.id);
      this.formularioContrato
        .get('contrato_nombre')
        ?.setValue(dato.contacto__nombre_corto);
      this.formularioContrato
        .get('identificacion')
        ?.setValue(dato.contacto__numero_identificacion);
      this.emitirContrato.emit(dato);
    }
    this.changeDetectorRef.detectChanges();
  }

  onSearch(event: any) {
    const searchTerm = event.target.value;
    if (!searchTerm) {
      this.reiniciarCamposBusqueda();
    }
    this.busquedaContrato.next(searchTerm);
  }

  reiniciarCamposBusqueda() {
    this.formularioContrato.get('identificacion')?.setValue('');
    this.formularioContrato.get('contrato_nombre')?.setValue('');
    this.formularioContrato.get('contrato')?.setValue('');
  }

  cambiarFiltroActivos(soloActivos: boolean) {
    this.mostrarSoloActivos = soloActivos;
    this.emitirCambioFiltro.emit(soloActivos);
    
    // Recargar resultados con el nuevo filtro
    const valorActual = this.formularioContrato.get('contrato_nombre')?.value || '';
    if (valorActual) {
      this.busquedaContrato.next(valorActual);
    } else {
      this.consultarContratos('', 'contacto__nombre_corto__icontains');
    }
  }
}
