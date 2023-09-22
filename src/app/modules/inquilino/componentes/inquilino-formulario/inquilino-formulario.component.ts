import { EventEmitter, Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { General } from '@comun/clases/general';
import { InquilinoFormulario } from '@interfaces/usuario/inquilino';
import { Plan } from '@modulos/inquilino/modelos/plan';
import { InquilinoService } from '@modulos/inquilino/servicios/inquilino.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-inquilino-formulario',
  templateUrl: './inquilino-formulario.component.html',
  styleUrls: ['./inquilino-formulario.component.scss'],
})
export class InquilinoFormularioComponent extends General implements OnInit {
  formularioEmpresa: FormGroup;
  codigoUsuario = '';
  planSeleccionado: Number = 2;
  arrPlanes: Plan[] = [];
  @Input() informacionInquilino!: InquilinoFormulario;
  srcResult: string = '/metronic8/demo1/assets/media/svg/avatars/blank.svg';
  @Input() visualizarBtnAtras: boolean = true;
  @Input() visualizarCampoSubdominio: boolean = true;
  @Output() dataFormulario: EventEmitter<any> = new EventEmitter();

  procesando = false;

  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(
    private formBuilder: FormBuilder,
    private inquilinoService: InquilinoService
  ) {
    super();
  }

  ngOnInit(): void {
    this.consultarPlanes();
    this.planSeleccionado =
      this.informacionInquilino.plan_id !== 0
        ? this.informacionInquilino.plan_id
        : this.planSeleccionado;
    this.initForm();
  }

  initForm() {
    this.formularioEmpresa = this.formBuilder.group({
      nombre: [
        this.informacionInquilino.nombre,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100), // Se ha removido la restricción de mayúsculas
        ]),
      ],
      subdominio: [
        this.informacionInquilino.subdominio,
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
    return this.formularioEmpresa.controls;
  }

  formSubmit() {
    if (this.formularioEmpresa.valid) {
      this.procesando = true;
      return this.dataFormulario.emit(this.formularioEmpresa.value);
    } else {
      this.formularioEmpresa.markAllAsTouched();
    }
  }

  cambiarTextoAMinusculas() {
    this.formFields.subdominio.setValue(
      this.formFields.subdominio.value.toLowerCase()
    );
  }

  confirmarExistencia() {
    if (this.formFields.subdominio.value !== '') {
      this.inquilinoService
        .consultarNombre(this.formFields.subdominio.value)
        .subscribe(({ validar }) => {
          if (!validar) {
            this.formFields.subdominio.setErrors({ EmpresaYaExiste: true });
            this.changeDetectorRef.detectChanges();
          }
        });
    }
  }

  consultarPlanes() {
    this.inquilinoService
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
