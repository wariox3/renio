import { CommonModule } from '@angular/common';
import {
  EventEmitter,
  Component,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
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
import { environment } from '@env/environment';
import { Plan } from '@interfaces/contenedor/plan';
import { ContenedorFormulario } from '@interfaces/usuario/contenedor';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { obtenerUsuarioCorreo } from '@redux/selectors/usuario.selectors';
import { asyncScheduler, tap, throttleTime, zip } from 'rxjs';
@Component({
  selector: 'app-contenedor-formulario',
  templateUrl: './contenedor-formulario.component.html',
  styleUrls: ['./contenedor-formulario.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    CardComponent,
    CommonModule,
    NgbDropdownModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ContenedorFormularioComponent extends General implements OnInit {
  formularioContenedor: FormGroup;
  codigoUsuario = '';
  procesando = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  planSeleccionado: Number = 3;
  informacionPlan: any = '';
  arrPlanes: Plan[] = [];
  arrTipoPersona: any[];
  arrCiudades: any[];
  srcResult: string = '/metronic8/demo1/assets/media/svg/avatars/blank.svg';
  nombreEmpresa = '';
  dominioApp = environment.dominioApp;

  @Input() informacionContenedor!: ContenedorFormulario;
  @Input() visualizarBtnAtras: boolean = true;
  @Input() visualizarCampoSubdominio: boolean = false;
  @Output() dataFormulario: EventEmitter<any> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private contenedorService: ContenedorService,
    private devuelveDigitoVerificacionService: DevuelveDigitoVerificacionService
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
      this.contenedorService.listaPlanes(),
      this.store.select(obtenerUsuarioCorreo)
    ).subscribe((respuesta: any) => {
      this.arrPlanes = respuesta[0];
      let posicion: keyof typeof this.contenedorService.informacionPlan = 3;
      this.informacionPlan = this.contenedorService.informacionPlan[posicion];
      this.formularioContenedor.get('correo')?.setValue(respuesta[2]);
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
          Validators.maxLength(25),
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
      correo: [
        this.informacionContenedor.correo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(255),
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        ]),
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
      reddoc: [
        true
      ],
      ruteo: [
        false
      ]
    });
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioContenedor?.markAsDirty();
    this.formularioContenedor?.markAsTouched();
    if (campo === 'subdominio') {
      if (!this.visualizarCampoSubdominio) {
        this.nombreEmpresa = this.formularioContenedor.get('nombre')!.value;
        this.nombreEmpresa = this.nombreEmpresa.replace(/ñ/gi, 'n');
        this.nombreEmpresa = this.nombreEmpresa.replace(/[^a-zA-Z0-9]/g, '');
        this.nombreEmpresa = this.nombreEmpresa
          .substring(0, 25)
          .toLocaleLowerCase();
        this.formularioContenedor.get(campo)?.setValue(this.nombreEmpresa);
        this.changeDetectorRef.detectChanges();
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
    let subdominio = this.formFields.subdominio.value.toLowerCase();
    subdominio = subdominio.replace(/ñ/gi, 'n');
    subdominio = subdominio.replace(/[^a-zA-Z0-9]/g, '');

    this.formFields.subdominio.setValue(subdominio.toLowerCase());
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

  seleccionarPlan(plan: any) {

    if(!plan.nombre.includes('ERP') ){
      this.planSeleccionado = plan.id;
      let posicion: keyof typeof this.contenedorService.informacionPlan = plan.id;
      this.informacionPlan = this.contenedorService.informacionPlan[posicion];
      this.changeDetectorRef.detectChanges();
    }


  }

  calcularDigitoVerificacion() {
    let digito = this.devuelveDigitoVerificacionService.digitoVerificacion(
      this.formularioContenedor.get('numero_identificacion')?.value
    );
    this.formularioContenedor.patchValue({
      digito_verificacion: digito,
    });
  }

  editarSubdominio() {
    this.visualizarCampoSubdominio = true;
    this.changeDetectorRef.detectChanges();
  }
}
