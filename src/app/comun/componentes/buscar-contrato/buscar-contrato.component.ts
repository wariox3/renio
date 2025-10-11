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
import { BuscarAvanzadoComponent } from '../buscar-avanzado/buscar-avanzado.component';
import {
  CONTRATO_FILTERS,
  CONTRATO_FILTRO_PERMANENTE,
  CONTRATO_LISTA_BUSCAR_AVANZADO,
} from '@modulos/humano/domain/mapeo/contrato.mapeo';
import {
  FiltroSwitchConfig,
  FiltroSwitchEvent,
} from '@comun/interfaces/filtro-switch.interface';

@Component({
  selector: 'app-buscar-contrato',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    TranslateModule,
    BuscarAvanzadoComponent,
  ],
  templateUrl: './buscar-contrato.component.html',
  styleUrl: './buscar-contrato.component.scss',
})
export class BuscarContratoComponent
  extends General
  implements OnInit, OnChanges
{
  @Input() informacionContrato = {
    identificacion: '',
    contrato: '',
    contrato_nombre: '',
  };
  @Input() requerido: boolean = false;
  @Input() formularioError: any = false;
  @Input() mostrarSoloActivos: boolean = false;
  @Input() mostrarToggleFiltro: boolean = true; // Permitir ocultar el toggle si no se necesita
  @Output() emitirContrato: EventEmitter<RegistroAutocompletarHumContrato> =
    new EventEmitter();
  @Output() emitirCambioFiltro: EventEmitter<boolean> = new EventEmitter();

  public formularioContrato: FormGroup;
  public arrContratos: RegistroAutocompletarHumContrato[] = [];
  public cargandoEmpleados$ = new BehaviorSubject<boolean>(false);
  public busquedaContrato = new Subject<string>();
  public campoListaContrato = CONTRATO_LISTA_BUSCAR_AVANZADO;
  public filtrosVerMas = CONTRATO_FILTERS;
  public filtrosPermanentes = CONTRATO_FILTRO_PERMANENTE;
  public switchesConfigContrato: FiltroSwitchConfig[] = [];

  private readonly formBuilder = inject(FormBuilder);
  private readonly _generalService = inject(GeneralService);

  constructor() {
    super();
    this._inicializarBusqueda();
  }

  ngOnInit(): void {
    this.iniciarFormulario();
    this._configurarSwitches();
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
    if (changes.mostrarSoloActivos || changes.mostrarToggleFiltro) {
      this._configurarSwitches();
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
    parametros = {
      ...parametros,
      estado_terminado: 'False',
    };

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
    parametros = {
      ...parametros,
      estado_terminado: 'False',
    };

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

  modificarCampoFormulario(
    campo: string,
    dato: RegistroAutocompletarHumContrato,
  ) {
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
    const valorActual =
      this.formularioContrato.get('contrato_nombre')?.value || '';
    if (valorActual) {
      this.busquedaContrato.next(valorActual);
    } else {
      this.consultarContratos('', 'contacto__nombre_corto__icontains');
    }
  }

  actualizarContrato(dato: any) {
    this.formularioContrato.get('contrato')?.setValue(dato.id);
    this.formularioContrato
      .get('contrato_nombre')
      ?.setValue(dato.contacto_nombre_corto);
    this.formularioContrato
      .get('identificacion')
      ?.setValue(dato.contacto_numero_identificacion);
    this.emitirContrato.emit({
      id: dato.id,
      contacto_id: dato.contacto_id,
      contacto__numero_identificacion: dato.contacto_numero_identificacion,
      contacto__nombre_corto: dato.contacto_nombre_corto,
    });
  }

  private _configurarSwitches() {
    if (this.mostrarToggleFiltro) {
      this.switchesConfigContrato = [
        {
          id: 'contratos-activos',
          label: 'Ver todos',
          checked: this.mostrarSoloActivos,
          parametroApi: 'estado_terminado',
          valorTrue: undefined, // No enviar parámetro cuando se muestran todos
          valorFalse: 'False', // Solo contratos activos
          tooltip:
            'Alternar entre mostrar solo contratos activos o todos los contratos',
        },
      ];
    }
  }

  onSwitchChange(evento: FiltroSwitchEvent) {
    if (evento.id === 'contratos-activos') {
      this.cambiarFiltroActivos(evento.checked);
    }
  }
}
