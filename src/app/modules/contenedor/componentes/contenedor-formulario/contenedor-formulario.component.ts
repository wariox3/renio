import { EventEmitter, Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { General } from '@comun/clases/general';
import { Plan } from '@interfaces/contenedor/plan';
import { ContenedorFormulario } from '@interfaces/usuario/contenedor';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-contenedor-formulario',
  templateUrl: './contenedor-formulario.component.html',
})
export class ContenedorFormularioComponent extends General implements OnInit {
  formularioContenedor: FormGroup;
  codigoUsuario = '';
  planSeleccionado: Number = 2;
  arrPlanes: Plan[] = [];
  @Input() informacionContenedor!: ContenedorFormulario;
  srcResult: string = '/metronic8/demo1/assets/media/svg/avatars/blank.svg';
  @Input() visualizarBtnAtras: boolean = true;
  @Input() visualizarCampoSubdominio: boolean = true;
  @Output() dataFormulario: EventEmitter<any> = new EventEmitter();

  procesando = false;

  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(
    private formBuilder: FormBuilder,
    private contenedorService: ContenedorService
  ) {
    super();
  }

  ngOnInit(): void {
    this.consultarPlanes();
    this.planSeleccionado =
      this.informacionContenedor.plan_id !== 0
        ? this.informacionContenedor.plan_id
        : this.planSeleccionado;
    this.initForm();
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

  consultarPlanes() {
    this.contenedorService
      .listaPlanes()
      .pipe(
        tap((respuesta: any) => {
          this.arrPlanes = respuesta;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  seleccionarPlan(plan_id: Number) {
    this.planSeleccionado = plan_id;
    this.changeDetectorRef.detectChanges();
  }
}
