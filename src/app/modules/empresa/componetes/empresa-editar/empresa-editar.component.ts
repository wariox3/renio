import { Ciudad } from './../../../../interfaces/general/ciudad';
import {
  Component,
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
import { Regimen } from '@interfaces/general/regimen';
import { TipoIdentificacion } from '@interfaces/general/tipoIdentificacion';
import { TipoPersona } from '@interfaces/general/tipoPersona';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { empresaActualizacionAction } from '@redux/actions/empresa.actions';
import { asyncScheduler, tap, throttleTime, zip } from 'rxjs';

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
  rededoc_id: null | number = null;
  @Input() empresa_id!: string;
  @Output() emitirActualizacion: EventEmitter<any> = new EventEmitter();
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;
  modalRef: any;

  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService,
    private contenedorService: ContenedorService,
    private devuelveDigitoVerificacionService: DevuelveDigitoVerificacionService
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
    if(this.formularioDian.valid){
      this.empresaService
      .activarEmpresa(this.empresa_id, this.formularioDian.value)
      .subscribe(() => {
        this.consultarInformacion()
      });
    } else {
      this.formularioDian.markAllAsTouched();
    }

  }
}
