import { EventEmitter, Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { General } from '@comun/clases/general';
import { EmpresaFormulario } from '@interfaces/usuario/empresa';
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
  planSeleccionado: Number = 2;
  arrPlanes: Plan[] = [];
  @Input() informacionEmpresa: EmpresaFormulario = {
    nombre: '',
    subdominio: '',
    plan_id: 0,
    imagen: null
  };
  srcResult: string = '/metronic8/demo1/assets/media/svg/avatars/blank.svg';
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
      plan_id: [
        this.informacionEmpresa.plan_id != 0 ? this.informacionEmpresa.plan_id : this.planSeleccionado,
        Validators.compose([Validators.required]),
      ],
      imagen: null
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

  seleccionarPlan(plan_id: Number) {
    this.planSeleccionado = plan_id;
    this.changeDetectorRef.detectChanges();
  }

  archivoSeleccionado(event: any) {
    const inputNode: any = event.target;

    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {

        this.srcResult = e.target.result;
        this.formularioEmpresa.patchValue({
          imagen: e.target.result
        })
        this.changeDetectorRef.detectChanges();

      };
      reader.readAsDataURL(inputNode.files[0]);
    }
  }

  removerArchivoSeleccionado(){
    this.srcResult = '/metronic8/demo1/assets/media/svg/avatars/blank.svg';
    this.formularioEmpresa.patchValue({
      imagen: null
    })
    this.changeDetectorRef.detectChanges();

  }
}
