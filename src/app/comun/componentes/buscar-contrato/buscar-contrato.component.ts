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
import { Filtros } from '@interfaces/comunes/componentes/filtros/filtros.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
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
  arrContratos: any[] = [];
  public cargandoEmpleados$ = new BehaviorSubject<boolean>(false);
  public busquedaContrato = new Subject<string>();
  @Input() informacionContrato = {
    identificacion: '',
    contrato: '',
    contrato_nombre: '',
  };
  @Input() requerido: boolean = false;
  @Input() formularioError: any = false;
  @Output() emitirContrato: EventEmitter<any> = new EventEmitter();

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
        })
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
    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarHumContrato>({
        filtros: [
          {
            propiedad,
            valor1: valor,
          },
        ],
        limite: 1000,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: 'HumContrato',
        serializador: 'ListaAutocompletar',
      })
      .pipe(
        tap((respuesta) => {
          this.arrContratos = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        }),
        finalize(() => this.cargandoEmpleados$.next(false))
      )
      .subscribe();
  }

  consultarContratosPorNombre(valor: string) {
    let filtros: Filtros[] = [];

    if (!valor.length) {
      filtros = [
        ...filtros,
        {
          propiedad: 'contacto__nombre_corto__icontains',
          valor1: `${valor}`,
          valor2: '',
        },
      ];
    } else if (isNaN(Number(valor))) {
      filtros = [
        ...filtros,
        {
          propiedad: 'contacto__nombre_corto__icontains',
          valor1: `${valor}`,
          valor2: '',
        },
      ];
    } else {
      filtros = [
        ...filtros,
        {
          propiedad: 'contacto__numero_identificacion__icontains',
          valor1: `${Number(valor)}`,
          valor2: '',
        },
      ];
    }

    let arrFiltros: ParametrosFiltros = {
      filtros,
      limite: 1000,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'HumContrato',
      serializador: 'ListaAutocompletar',
    };

    return this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarHumContrato>(arrFiltros)
      .pipe(
        tap((respuesta) => {
          this.arrContratos = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        }),
        finalize(() => this.cargandoEmpleados$.next(false))
      );
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioContrato?.markAsDirty();
    this.formularioContrato?.markAsTouched();
    if (campo === 'contrato') {
      this.formularioContrato.get(campo)?.setValue(dato.contrato_id);
      this.formularioContrato
        .get('contrato_nombre')
        ?.setValue(dato.contrato_contacto_nombre_corto);
      this.formularioContrato
        .get('identificacion')
        ?.setValue(dato.contrato_contacto_numero_identificacion);
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
}
