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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { General } from '@comun/clases/general';
import { DevuelveDigitoVerificacionService } from '@comun/services/devuelve-digito-verificacion.service';
import { HttpService } from '@comun/services/http.service';
import { Regimen } from '@interfaces/general/regimen';
import { TipoIdentificacion } from '@interfaces/general/tipoIdentificacion';
import { TipoPersona } from '@interfaces/general/tipoPersona';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { empresaActualizacionAction } from '@redux/actions/empresa.actions';
import { asyncScheduler, tap, throttleTime, zip } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-empresa-editar',
  templateUrl: './empresa-editar.component.html',
})
export class EmpresaEditarComponent extends General implements OnInit {
  formularioEmpresa: FormGroup;
  formularioDian: FormGroup;
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
    private devuelveDigitoVerificacionService: DevuelveDigitoVerificacionService,
    private httpService: HttpService,
    private modalService: NgbModal
  ) {
    super();
  }

  ngOnInit() {
    this.initForm();
    this.initFormDian();
    this.consultarInformacion();
  }

  consultarInformacion() {
    zip(
      this.contenedorService.listaTipoIdentificacion(),
      this.empresaService.consultarDetalle(this.empresa_id),
      this.contenedorService.listaRegimen(),
      this.contenedorService.listaTipoPersona()
    ).subscribe((respuesta: any) => {
      this.arrIdentificacion = respuesta[0].registros;
      this.formularioEmpresa.patchValue({
        nombre_corto: respuesta[1].nombre_corto,
        correo: respuesta[1].correo,
        digito_verificacion: respuesta[1].digito_verificacion,
        direccion: respuesta[1].direccion,
        numero_identificacion: respuesta[1].numero_identificacion,
        telefono: respuesta[1].telefono,
        identificacion: respuesta[1].identificacion_id,
        ciudad_nombre: respuesta[1].ciudad_nombre,
        ciudad: respuesta[1].ciudad_id,
        tipo_persona: respuesta[1].tipo_persona,
        regimen: respuesta[1].regimen,
      });
      this.rededoc_id = respuesta[1].rededoc_id;
      this.arrRegimen = respuesta[2].registros;
      this.arrTipoPersona = respuesta[3].registros;
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

  initFormDian() {
    this.formularioDian = this.formBuilder.group({
      setPruebas: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-z-A-Z-0-9]*$/),
        ]),
      ],
      resolucion_numero: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-z-A-Z-0-9]*$/),
        ]),
      ],
      resolucion_id: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-z-A-Z-0-9]*$/),
        ]),
      ],
    });
  }

  formSubmit() {
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
  }

  consultarCiudad(event: any) {
    let arrFiltros = {
      filtros: [
        {
          operador: '__contains',
          propiedad: 'nombre__contains',
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
      this.formularioEmpresa.get(campo)?.setValue(dato.ciudad_id);
      this.formularioEmpresa.get('ciudad_nombre')?.setValue(dato.ciudad_nombre);
    }
    if (campo === 'resolucion_id') {
      this.formularioDian.get(campo)?.setValue(dato.resolucion_id);
      this.formularioDian
        .get('resolucion_numero')
        ?.setValue(dato.resolucion_numero);
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

  activarEmpresa() {
    if (this.formularioDian.valid) {
      this.empresaService
        .activarEmpresa(this.empresa_id, this.formularioDian.value)
        .subscribe(() => {
          this.consultarInformacion();
        });
    } else {
      this.formularioDian.markAllAsTouched();
    }
  }

  consultarResolucion(event: any) {
    let arrFiltros = {
      filtros: [
        {
          id: '1692284537644-1688',
          operador: '__contains',
          propiedad: 'numero__contains',
          valor1: `${event?.target.value}`,
          valor2: '',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'Resolucion',
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista-autocompletar/',
        arrFiltros
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrResoluciones = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  abirModal(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.changeDetectorRef.detectChanges();
  }

  cerrarModal(): void {
    this.inputBusquedaResolucion.nativeElement.focus();
    this.changeDetectorRef.detectChanges();
    this.modalService.dismissAll();
    this.changeDetectorRef.detectChanges();
  }
}
