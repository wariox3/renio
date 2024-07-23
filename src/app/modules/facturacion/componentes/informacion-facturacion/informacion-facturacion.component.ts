import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
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
import { HttpService } from '@comun/services/http.service';
import { MultiplesEmailValidator } from '@comun/validaciones/multiplesEmailValidator';
import { FacturacionService } from '@modulos/facturacion/servicios/facturacion.service';
import {
  NgbActiveModal,
  NgbDropdown,
  NgbDropdownModule,
  NgbModal,
  NgbModalModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { asyncScheduler, tap, throttleTime, zip } from 'rxjs';

@Component({
  selector: 'app-informacion-facturacion',
  standalone: true,
  imports: [
    CommonModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbDropdownModule,
  ],
  templateUrl: './informacion-facturacion.component.html',
  styleUrl: './informacion-facturacion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformacionFacturacionComponent extends General implements OnInit {
  formularioInformacion: FormGroup;
  informacionFacturacion = {
    numero_identificacion: '',
    digito_verificacion: '',
    direccion: '',
    correo: '',
    telefono: '',
    nombre_corto: '',
    identificacion_id: '',
    ciudad_id: '',
    usuario: '',
  };
  arrCiudades: any[];
  arrIdentificacion: any[];
  codigoUsuario = '';

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private httpService: HttpService,
    private devuelveDigitoVerificacionService: DevuelveDigitoVerificacionService,
    private facturacionService: FacturacionService
  ) {
    super();
  }

  @Input() informacion_id?: string;
  @Input() validarNuevoEditar: boolean = true;
  @Output() emitirActualizacion: EventEmitter<any> = new EventEmitter();
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;
  public ciudadDropdown: NgbDropdown;
  selectedDateIndex: number = -1;
  modalRef: any;

  ngOnInit(): void {
    this.consultarInformacion();
    this.iniciarFormulario();
    this.store.select(obtenerUsuarioId).subscribe((codigoUsuario) => {
      this.codigoUsuario = codigoUsuario;
      this.changeDetectorRef.detectChanges();
    });
  }

  iniciarFormulario() {
    this.formularioInformacion = this.formBuilder.group(
      {
        nombre_corto: [
          this.informacionFacturacion.nombre_corto,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        digito_verificacion: [this.informacionFacturacion.digito_verificacion],
        numero_identificacion: [
          this.informacionFacturacion.numero_identificacion,
          Validators.compose([
            Validators.required,
            Validators.maxLength(20),
            Validators.pattern(/^[0-9]+$/),
          ]),
        ],
        identificacion: [
          this.informacionFacturacion.identificacion_id,
          Validators.compose([Validators.required]),
        ],
        ciudad_nombre: [''],
        ciudad: [
          this.informacionFacturacion.ciudad_id,
          Validators.compose([Validators.required]),
        ],
        direccion: [
          this.informacionFacturacion.direccion,
          Validators.compose([Validators.required, Validators.maxLength(50)]),
        ],
        correo: [
          this.informacionFacturacion.correo,
          Validators.compose([Validators.required, Validators.maxLength(255)]),
        ],
        telefono: [
          this.informacionFacturacion.telefono,
          Validators.compose([Validators.required, Validators.maxLength(50)]),
        ],
        usuario: [this.informacionFacturacion.usuario],
      },
      {
        validator: MultiplesEmailValidator.validarCorreos,
      }
    );
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
      modelo: 'Ciudad',
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista-autocompletar/',
        arrFiltros
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrCiudades = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  consultarInformacion() {
    zip(
      this.httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista-autocompletar/',
        {
          filtros: [
            {
              id: '1692284537644-1688',
              operador: '__icontains',
              propiedad: 'nombre__icontains',
              valor1: ``,
              valor2: '',
            },
          ],
          limite: 0,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'Identificacion',
        }
      )
    ).subscribe((respuesta: any) => {
      this.arrIdentificacion = respuesta[0].registros;
      this.changeDetectorRef.detectChanges();
    });
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioInformacion?.markAsDirty();
    this.formularioInformacion?.markAsTouched();
    if (campo === 'ciudad') {
      if (dato === null) {
        this.formularioInformacion.get('ciudad_nombre')?.setValue(null);
        this.formularioInformacion.get('ciudad')?.setValue(null);
      } else {
        this.formularioInformacion
          .get('ciudad_nombre')
          ?.setValue(dato.ciudad_nombre);
        this.formularioInformacion.get('ciudad')?.setValue(dato.ciudad_id);
      }
    }
    this.changeDetectorRef.detectChanges();
  }

  calcularDigitoVerificacion() {
    let digito = this.devuelveDigitoVerificacionService.digitoVerificacion(
      this.formularioInformacion.get('numero_identificacion')?.value
    );
    this.formularioInformacion.patchValue({
      digito_verificacion: digito,
    });
  }

  openModal() {
    if (!this.validarNuevoEditar) {
      this.facturacionService
        .obtenerInformacionFacturacion(this.informacion_id)
        .subscribe((respuesta: any) => {
          this.informacionFacturacion = respuesta;
          this.formularioInformacion.patchValue({
            nombre_corto: respuesta.nombre_corto,
            numero_identificacion: respuesta.numero_identificacion,
            direccion: respuesta.direccion,
            telefono: respuesta.telefono,
            identificacion: respuesta.identificacion_id,
            ciudad: respuesta.ciudad_id,
            correo: respuesta.correo,
            ciudad_nombre: respuesta.ciudad_nombre,
            usuario: respuesta.usuario_id,
            digito_verificacion: respuesta.digito_verificacion,
          });
        });
    }
    this.modalRef = this.modalService.open(this.customTemplate, {
      backdrop: 'static',
      size: 'lg',
      keyboard: false,
    });

    this.changeDetectorRef.detectChanges();
  }

  enviar() {
    if (this.formularioInformacion.valid) {
      if(!this.validarNuevoEditar){
        this.facturacionService
        .actualizarDatosInformacionFacturacion(
          this.informacion_id,
          this.formularioInformacion.value
        )
        .subscribe((respuesta) => {
          this.modalService.dismissAll();
          this.alertaService.mensajaExitoso(
            this.translateService.instant(
              'FORMULARIOS.MENSAJES.COMUNES.PROCESANDOACTUALIZACION'
            )
          );
          return this.emitirActualizacion.emit(true);
        });
      } else {
        this.formularioInformacion.patchValue({
          usuario: this.codigoUsuario
        })
        this.facturacionService
        .crearInformacionFacturacion(
          this.formularioInformacion.value
        )
        .subscribe((respuesta) => {
          this.modalService.dismissAll();
          this.alertaService.mensajaExitoso(
            this.translateService.instant(
              'FORMULARIOS.MENSAJES.COMUNES.PROCESANDOACTUALIZACION'
            )
          );
          return this.emitirActualizacion.emit(true);
        });
      }

    } else {
      this.formularioInformacion.markAllAsTouched();
    }
  }

}
