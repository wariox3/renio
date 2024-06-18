import { CommonModule } from '@angular/common';
import { EventEmitter, Component, Input, OnInit, Output, Renderer2 } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { DevuelveDigitoVerificacionService } from '@comun/services/devuelve-digito-verificacion.service';
import { Plan } from '@interfaces/contenedor/plan';
import { ContenedorFormulario } from '@interfaces/usuario/contenedor';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, tap, throttleTime, zip } from 'rxjs';
@Component({
  selector: 'app-contenedor-formulario',
  templateUrl: './contenedor-formulario.component.html',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    CardComponent,
    CommonModule,
    NgbDropdownModule,
    FormsModule,
    ReactiveFormsModule
],
})
export class ContenedorFormularioComponent extends General implements OnInit {
  formularioContenedor: FormGroup;
  codigoUsuario = '';
  procesando = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  planSeleccionado: Number = 2;
  informacionPlan: any = '';
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
    private renderer: Renderer2
  ) {
    super();
  }

  ngOnInit(): void {
    this.planSeleccionado =
      this.informacionContenedor.plan_id !== 0
        ? this.informacionContenedor.plan_id
        : this.planSeleccionado;
    this.initForm();
    this.consultarInformacion();
  }

  consultarInformacion() {
    zip(
      this.contenedorService.listaTipoIdentificacion(),
      this.contenedorService.listaPlanes()
    ).subscribe((respuesta: any) => {
      this.arrIdentificacion = respuesta[0].registros;
      this.arrPlanes = respuesta[1];
      let posicion: keyof typeof this.contenedorService.informacionPlan = 2;
      this.informacionPlan = this.contenedorService.informacionPlan[posicion]
      this.changeDetectorRef.detectChanges();
    });
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

  initForm() {
    this.formularioContenedor = this.formBuilder.group({
      subdominio: [
        this.informacionContenedor.subdominio,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[a-z-0-9]*$/),
        ]),
      ],
      nombre: [
        this.informacionContenedor.nombre,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100), // Se ha removido la restricción de mayúsculas
        ]),
      ],
      plan_id: [
        this.planSeleccionado,
        Validators.compose([Validators.required]),
      ],
      direccion: [
        this.informacionContenedor.direccion,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      correo: [
        this.informacionContenedor.correo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(255),
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        ]),
      ],
      ciudad_nombre: [this.informacionContenedor.ciudad_nombre],
      ciudad_id: [
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
      identificacion_id: [
        this.informacionContenedor.identificacion,
        Validators.compose([Validators.required]),
      ],
      telefono: [
        this.informacionContenedor.telefono,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[0-9]+$/),
        ]),
      ],
    });
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioContenedor?.markAsDirty();
    this.formularioContenedor?.markAsTouched();
    if (campo === 'ciudad_id') {
      if(dato === null){
        this.formularioContenedor.get(campo)?.setValue(null);
        this.formularioContenedor
          .get('ciudad_nombre')
          ?.setValue(null);
      } else {
        this.formularioContenedor.get(campo)?.setValue(dato.ciudad_id);
        this.formularioContenedor
          .get('ciudad_nombre')
          ?.setValue(dato.ciudad_nombre);
      }
    }
    this.changeDetectorRef.detectChanges();
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

  seleccionarPlan(plan_id: any) {
    this.planSeleccionado = plan_id;
    let posicion: keyof typeof this.contenedorService.informacionPlan = plan_id;
    this.informacionPlan = this.contenedorService.informacionPlan[posicion]
    this.changeDetectorRef.detectChanges();
  }

  calcularDigitoVerificacion() {
    let digito = this.devuelveDigitoVerificacionService.digitoVerificacion(
      this.formularioContenedor.get('numero_identificacion')?.value
    );
    this.formularioContenedor.patchValue({
      digito_verificacion: digito,
    });
  }
}
