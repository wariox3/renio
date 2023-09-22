import { HttpClient } from '@angular/common/http';
import { EventEmitter, Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { General } from '@comun/clases/general';
import { DevuelveDigitoVerificacionService } from '@comun/services/devuelve-digito-verificacion.service';
import { Plan } from '@interfaces/contenedor/plan';
import { ContenedorFormulario } from '@interfaces/usuario/contenedor';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';
import { asyncScheduler, tap, throttleTime, zip } from 'rxjs';
@Component({
  selector: 'app-contenedor-formulario',
  templateUrl: './contenedor-formulario.component.html',
})
export class ContenedorFormularioComponent extends General implements OnInit {

  formularioContenedor: FormGroup;
  codigoUsuario = '';
  procesando = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  planSeleccionado: Number = 2;
  arrPlanes: Plan[] = [];
  arrIdentificacion: any[];
  arrTipoPersona: any[];
  arrCiudades: any[];
  srcResult: string = '/metronic8/demo1/assets/media/svg/avatars/blank.svg';
  @Input() informacionContenedor!: ContenedorFormulario;
  @Input() visualizarBtnAtras: boolean = true;
  @Input() visualizarCampoSubdominio: boolean = true;
  @Output() dataFormulario: EventEmitter<any> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private contenedorService: ContenedorService,
    private devuelveDigitoVerificacionService: DevuelveDigitoVerificacionService,
    private http: HttpClient
      ) {
    super();
  }

  ngOnInit(): void {
    this.consultarInformacion()
    this.planSeleccionado =
      this.informacionContenedor.plan_id !== 0
        ? this.informacionContenedor.plan_id
        : this.planSeleccionado;
    this.initForm();
  }

  consultarInformacion(){
    zip(
      this.contenedorService.listaCiudades(),
      this.contenedorService.listaTipoIdentificacion(),
      this.contenedorService.listaPlanes(),
    ).subscribe((respuesta)=>{
      console.log(respuesta);
      // this.arrIdentificacion = respuesta[0];
      // this.arrTipoPersona = respuesta[1];
      // this.arrPlanes = respuesta[2];

    })
  }

  consultarCiudad(event: any) {
    let arrFiltros = {
      filtros: [
        {
          id: '1692284537644-1688',
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
      modelo: 'Ciudad',
    };

    this.http
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

  modificarCampoFormulario(campo: string, dato: any) {
    if (campo === 'ciudad') {
      this.formularioContenedor.get(campo)?.setValue(dato.ciudad_id);
      this.formularioContenedor
        .get('ciudad_nombre')
        ?.setValue(dato.ciudad_nombre);
    }
    this.changeDetectorRef.detectChanges();
  }


  initForm() {
    this.formularioContenedor = this.formBuilder.group({
      nombre: [
        this.informacionContenedor.nombre,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100), // Se ha removido la restricción de mayúsculas
        ]),
      ],
      subdominio: [
        this.informacionContenedor.subdominio,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[a-z-0-9]*$/), // Se ha removido la restricción de mayúsculas
        ]),
      ],
      plan_id: [
        this.planSeleccionado,
        Validators.compose([Validators.required]),
      ],
      nombre_corto: [
        this.informacionContenedor.nombre_corto,
        Validators.compose([
          Validators.maxLength(200),
          Validators.pattern(/^[a-zA-Z0-9&.\-_\s]*$/),
        ]),
      ],
      direccion: [
        this.informacionContenedor.direccion,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      correo: [
        this.informacionContenedor.correo,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.maxLength(255),
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        ]),
      ],
      ciudad_nombre: [this.informacionContenedor.ciudad_nombre],
      ciudad: [
        this.informacionContenedor.ciudad,
        Validators.compose([Validators.required]),
      ],
      numero_identificacion: [
        this.informacionContenedor.numero_identificacion,
        Validators.compose([
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(/^[0-9]+$/),
        ]),
      ],
      digito_verificacion: [
        this.informacionContenedor.digito_verificacion,
        Validators.compose([Validators.required, Validators.maxLength(1)]),
      ],
      identificacion: [
        this.informacionContenedor.identificacion,
        ,
        Validators.compose([Validators.required]),
      ],
    });
  }

  get formFields() {
    return this.formularioContenedor.controls;
  }

  formSubmit() {
    if (this.formularioContenedor.valid) {
      this.procesando = true;
      return this.dataFormulario.emit(this.formularioContenedor.value);
    } else {
      this.formularioContenedor.markAllAsTouched();
    }
  }

  cambiarTextoAMinusculas() {
    this.formFields.subdominio.setValue(
      this.formFields.subdominio.value.toLowerCase()
    );
  }

  confirmarExistencia() {
    if (this.formFields.subdominio.value !== '') {
      this.contenedorService
        .consultarNombre(this.formFields.subdominio.value)
        .subscribe(({ validar }) => {
          if (!validar) {
            this.formFields.subdominio.setErrors({ ContenedorYaExiste: true });
            this.changeDetectorRef.detectChanges();
          }
        });
    }
  }

  seleccionarPlan(plan_id: Number) {
    this.planSeleccionado = plan_id;
    this.changeDetectorRef.detectChanges();
  }

  calcularDigitoVerificacion(){
    let digito = this.devuelveDigitoVerificacionService.digitoVerificacion(
      this.formularioContenedor.get('numero_identificacion')?.value
    );
    this.formularioContenedor.patchValue({
      digito_verificacion: digito,
    });
  }
}
