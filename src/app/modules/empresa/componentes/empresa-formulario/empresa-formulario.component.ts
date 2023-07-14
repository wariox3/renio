import { EventEmitter, Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { General } from '@comun/clases/general';
import { Plan } from '@modulos/empresa/modelos/plan';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-empresa-formulario',
  templateUrl: './empresa-formulario.component.html',
  styleUrls: ['./empresa-formulario.component.scss'],
})
export class EmpresaFormularioComponent extends General implements OnInit {
  formularioEmpresa: FormGroup;
  codigoUsuario = '';
  planSeleccionado: Number = 0;
  arrPlanes:Plan[] = [];
  @Input() informacionEmpresa: any = {
    nombre: '',
    subdominio: '',
  };
  @Input() visualizarBtnAtras: boolean = true;
  @Input() visualizarCampoSubdominio: boolean = true;
  @Output() dataFormulario: EventEmitter<any> = new EventEmitter();

  procesando = false;

  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.consultarPlanes();
  }

  initForm() {
    this.formularioEmpresa = this.formBuilder.group({
      nombre: [
        this.informacionEmpresa.nombre,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100), // Se ha removido la restricción de mayúsculas
        ]),
      ],
      subdominio: [
        this.informacionEmpresa.subdominio,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[a-z-0-9]*$/), // Se ha removido la restricción de mayúsculas
        ]),
      ],
      plan: ['', Validators.compose([Validators.required])],
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
      this.empresaService
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
    this.empresaService
      .listaPlanes()
      .pipe(
        tap((respuesta: any) => {
          this.arrPlanes = respuesta;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  seleccionarPlan(plan_id: Number){
    this.planSeleccionado = plan_id
    this.changeDetectorRef.detectChanges();
  }
}
