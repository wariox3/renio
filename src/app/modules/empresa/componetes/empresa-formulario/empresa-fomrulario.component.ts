import { Ciudad } from '@interfaces/general/ciudad';
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
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { DevuelveDigitoVerificacionService } from '@comun/services/devuelve-digito-verificacion.service';
import { Regimen } from '@interfaces/general/regimen';
import { TipoIdentificacion } from '@interfaces/general/tipoIdentificacion';
import { TipoPersona } from '@interfaces/general/tipoPersona';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { empresaActualizacionAction } from '@redux/actions/empresa.actions';
import { asyncScheduler, tap, throttleTime, zip } from 'rxjs';
import {
  NgbDropdown,
  NgbDropdownAnchor,
  NgbDropdownMenu,
  NgbDropdownItem,
} from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import {
  NgClass,
  NgTemplateOutlet,
  NgFor,
  NgIf,
  LowerCasePipe,
  TitleCasePipe,
  CommonModule,
} from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent } from '@comun/componentes/card/card.component';
import { obtenerEmpresaId } from '@redux/selectors/empresa.selectors';

@Component({
  selector: 'app-empresa-formulario',
  templateUrl: './empresa-formulario.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    NgClass,
    NgTemplateOutlet,
    NgFor,
    NgbDropdown,
    NgbDropdownAnchor,
    NgbDropdownMenu,
    NgbDropdownItem,
    NgxMaskDirective,
    CommonModule,
    LowerCasePipe,
    TitleCasePipe,
  ],
  providers: [provideNgxMask()],
})
export class EmpresaEditarComponent extends General implements OnInit {
  formularioEmpresa: FormGroup;
  planSeleccionado: Number = 2;
  arrCiudades: Ciudad[] = [];
  arrIdentificacion: TipoIdentificacion[] = [];
  arrTipoPersona: TipoPersona[] = [];
  arrRegimen: Regimen[] = [];
  arrResoluciones: any[] = [];
  rededoc_id: null | number = null;
  @Input() empresa_id!: string;
  @Output() emitirActualizacion: EventEmitter<any> = new EventEmitter();
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;
  @ViewChild('inputBusquedaResolucion', { static: true })
  inputBusquedaResolucion!: ElementRef<HTMLInputElement>;

  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService,
    private contenedorService: ContenedorService,
    private devuelveDigitoVerificacionService: DevuelveDigitoVerificacionService
  ) {
    super();
  }

  ngOnInit() {
    this.store
      .select(obtenerEmpresaId)
      .subscribe((id) => (this.empresa_id = id));
    this.initForm();
    this.consultarInformacion();
  }

  consultarInformacion() {
    zip(
      this.contenedorService.listaTipoIdentificacion(),
      this.contenedorService.listaRegimen(),
      this.contenedorService.listaTipoPersona(),
      this.empresaService.consultarDetalle(this.empresa_id)
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
        tipo_persona: respuesta[3].tipo_persona,
        regimen: respuesta[3].regimen,
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
    if (this.formularioEmpresa.valid) {
      this.empresaService
        .actualizarDatosEmpresa(1, this.formularioEmpresa.value)
        .pipe(
          tap((respuestaActualizacion: any) => {
            if (respuestaActualizacion.actualizacion) {
              this.alertaService.mensajaExitoso(
                this.translateService.instant(
                  'FORMULARIOS.MENSAJES.COMUNES.PROCESANDOACTUALIZACION'
                )
              );
              this.store.dispatch(
                empresaActualizacionAction({
                  empresa: respuestaActualizacion.empresa,
                })
              );
            }
          })
        )
        .subscribe();
    } else {
      this.formularioEmpresa.markAllAsTouched();
    }
  }

  consultarCiudad(event: any) {
    let arrFiltros = {
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
      modelo: 'ContenedorCiudad',
    };
    this.contenedorService
      .listaCiudades(arrFiltros)
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta: any) => {
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
      } else {
        this.formularioEmpresa.get(campo)?.setValue(dato.ciudad_id);
        this.formularioEmpresa
          .get('ciudad_nombre')
          ?.setValue(dato.ciudad_nombre);
      }
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
