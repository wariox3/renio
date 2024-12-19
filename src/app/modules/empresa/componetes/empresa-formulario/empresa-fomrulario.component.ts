import { CommonModule, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { DevuelveDigitoVerificacionService } from '@comun/services/devuelve-digito-verificacion.service';
import { GeneralService } from '@comun/services/general.service';
import {
  RegistroAutocompletarGenCiudad,
  RegistroAutocompletarGenIdentificacion,
  RegistroAutocompletarGenRegimen
} from '@interfaces/comunes/autocompletar/autocompletar';
import { Regimen } from '@interfaces/general/regimen';
import { TipoIdentificacion } from '@interfaces/general/tipoIdentificacion';
import { TipoPersona } from '@interfaces/general/tipoPersona';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import {
  NgbDropdown,
  NgbDropdownAnchor,
  NgbDropdownItem,
  NgbDropdownMenu,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { empresaActualizacionAction } from '@redux/actions/empresa.actions';
import { obtenerEmpresaId } from '@redux/selectors/empresa.selectors';
import { provideNgxMask } from 'ngx-mask';
import { asyncScheduler, of, switchMap, tap, throttleTime, zip } from 'rxjs';
import { RegistroAutocompletarGenTipoPersona } from '../../../../interfaces/comunes/autocompletar/autocompletar';

@Component({
  selector: 'app-empresa-formulario',
  templateUrl: './empresa-formulario.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgTemplateOutlet,
    NgbDropdown,
    NgbDropdownAnchor,
    NgbDropdownMenu,
    NgbDropdownItem,
    CommonModule,
  ],
  providers: [provideNgxMask()],
})
export class EmpresaFormularioComponent extends General implements OnInit {
  formularioEmpresa: FormGroup;
  planSeleccionado: Number = 2;
  ciudadSeleccionada: string | null;
  arrCiudades: any[] = [];
  arrIdentificacion: TipoIdentificacion[] = [];
  arrTipoPersona: TipoPersona[] = [];
  arrRegimen: Regimen[] = [];
  arrResoluciones: any[] = [];
  rededoc_id: null | number = null;
  @Input() empresaId!: string;
  @Input() visualizarLabelSiguiente: boolean = false;
  @Output() emitirRegistroGuardado: EventEmitter<any> = new EventEmitter();
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;
  @ViewChild('inputBusquedaResolucion', { static: true })
  inputBusquedaResolucion!: ElementRef<HTMLInputElement>;

  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService,
    private devuelveDigitoVerificacionService: DevuelveDigitoVerificacionService,
    private _generalServices: GeneralService
  ) {
    super();
  }

  ngOnInit() {
    this.store
      .select(obtenerEmpresaId)
      .subscribe((id) => (this.empresaId = id));
    this.initForm();
    this.consultarInformacion();
  }

  consultarInformacion() {
    zip(
      this._generalServices.consultarDatosAutoCompletar<RegistroAutocompletarGenIdentificacion>(
        {
          modelo: 'GenIdentificacion',
          serializador: 'ListaAutocompletar',
        }
      ),
      this._generalServices.consultarDatosAutoCompletar<RegistroAutocompletarGenRegimen>(
        {
          modelo: 'GenRegimen',
          serializador: 'ListaAutocompletar',
        }
      ),
      this._generalServices.consultarDatosAutoCompletar<RegistroAutocompletarGenTipoPersona>(
        {
          modelo: 'GenTipoPersona',
          serializador: 'ListaAutocompletar',
        }
      ),
      this.empresaService.consultarDetalle(this.empresaId)
    ).subscribe((respuesta: any) => {
      this.arrIdentificacion = respuesta[0].registros;
      this.arrRegimen = respuesta[1].registros;
      this.arrTipoPersona = respuesta[2].registros;
      this.rededoc_id = respuesta[3].rededoc_id;
      this.formularioEmpresa.patchValue({
        nombre_corto: respuesta[3].nombre_corto,
        correo: respuesta[3].correo,
        digito_verificacion: respuesta[3].digito_verificacion,
        direccion: respuesta[3].direccion,
        numero_identificacion: respuesta[3].numero_identificacion,
        telefono: respuesta[3].telefono,
        identificacion: respuesta[3].identificacion_id,
        ciudad_nombre: respuesta[3].ciudad_nombre,
        ciudad: respuesta[3].ciudad_id,
        tipo_persona: respuesta[3].tipo_persona_id,
        regimen: respuesta[3].regimen_id,
      });
      this.changeDetectorRef.detectChanges();
    });
  }

  initForm() {
    this.formularioEmpresa = this.formBuilder.group({
      nombre_corto: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
      direccion: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      correo: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(255),
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        ]),
      ],
      ciudad_nombre: [''],
      ciudad: ['', Validators.compose([Validators.required])],
      numero_identificacion: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(/^[0-9]+$/),
        ]),
      ],
      digito_verificacion: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(1)]),
      ],
      identificacion: ['', Validators.compose([Validators.required])],
      telefono: [
        '',
        Validators.compose([
          Validators.minLength(7),
          Validators.maxLength(50),
          Validators.pattern(/^[0-9]+$/),
        ]),
      ],
      tipo_persona: ['', Validators.compose([Validators.required])],
      regimen: ['', Validators.compose([Validators.required])],
    });
  }

  formSubmit() {
    this.store
      .select(obtenerEmpresaId)
      .subscribe((id) => (this.empresaId = id));

    if (this.formularioEmpresa.valid) {
      this.empresaService
        .actualizarDatosEmpresa(1, this.formularioEmpresa.value)
        .pipe(
          switchMap((respuestaActualizacion: any) => {
            if (respuestaActualizacion.actualizacion) {
              return this.store.select(obtenerEmpresaId);
            }
            return of(null);
          }),
          switchMap((respuestaEmpresa_id: any) => {
            this.alertaService.mensajaExitoso(
              this.translateService.instant(
                'FORMULARIOS.MENSAJES.COMUNES.PROCESANDOACTUALIZACION'
              )
            );
            return this.empresaService.consultarDetalle(respuestaEmpresa_id);
          }),
          tap((respuestaConsultaEmpresa: any) => {
            this.store.dispatch(
              empresaActualizacionAction({
                empresa: respuestaConsultaEmpresa,
              })
            );
            this.changeDetectorRef.detectChanges();
            return this.emitirRegistroGuardado.emit(true);
          })
        )
        .subscribe();
    } else {
      this.formularioEmpresa.markAllAsTouched();
    }
  }

  consultarCiudad(event: any) {
    this._generalServices.consultarDatosAutoCompletar<RegistroAutocompletarGenCiudad>(
      {
        filtros: [
          {
            operador: '__icontains',
            propiedad: 'nombre__icontains',
            valor1: `${event?.target.value}`,
            valor2: '',
          },
        ],
        limite: 10,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: 'GenCiudad',
        serializador: 'ListaAutocompletar',
      }
    ).pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrCiudades = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  modificarCampoFormulario(campo: string, dato: any) {
    if (campo === 'ciudad') {
      if (dato === null) {
        this.formularioEmpresa.get(campo)?.setValue(null);
        this.formularioEmpresa.get('ciudad_nombre')?.setValue(null);
        this.ciudadSeleccionada = null;
      } else {
        this.ciudadSeleccionada = dato.nombre;
        this.formularioEmpresa.get(campo)?.setValue(dato.id);
        this.formularioEmpresa
          .get('ciudad_nombre')
          ?.setValue(`${dato.nombre} - ${dato.estado_nombre}`);
      }
    }
    if (campo === 'ciudad_nombre') {
      this.formularioEmpresa.get('ciudad_nombre')?.setValue(dato);
    }
    if (campo === 'telefono') {
      if (this.formularioEmpresa.get(campo)?.value === '') {
        this.formularioEmpresa.get(campo)?.setValue(dato);
      }
    }
    this.changeDetectorRef.detectChanges();
  }

  seleccionarPlan(plan_id: Number) {
    this.planSeleccionado = plan_id;
    this.changeDetectorRef.detectChanges();
  }

  calcularDigitoVerificacion() {
    let digito = this.devuelveDigitoVerificacionService.digitoVerificacion(
      this.formularioEmpresa.get('numero_identificacion')?.value
    );
    this.formularioEmpresa.patchValue({
      digito_verificacion: digito,
    });
  }
}
