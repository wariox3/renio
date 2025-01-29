import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from '@comun/validaciones/confirm-password.validator';
import { AuthService } from '@modulos/auth';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { NgbActiveModal, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { General } from '@comun/clases/general';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-seguridad-cambio-clave',
  templateUrl: './cambio-clave.component.html',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModalModule,
    TranslateModule,
]
})

export class CambioClaveComponent extends General implements OnInit {
  codigoUsuario = 0;
  formularioCambioClave: FormGroup;
  cambiarTipoCampoClave: 'text' | 'password' = 'password';
  cambiarTipoCampoNuevaClave: 'text' | 'password' = 'password';
  cambiarTipoCampoConfirmarNuevaClave: 'text' | 'password' = 'password';
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;
  modalRef: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {
    super()
  }

  ngOnInit(): void {
    this.initForm();
    this.store.select(obtenerUsuarioId).subscribe((codigoUsuario) => {
      this.codigoUsuario = codigoUsuario;
      this.changeDetectorRef.detectChanges();
    });
  }

  visualizarClave() {
    if (this.cambiarTipoCampoClave === 'password') {
      this.cambiarTipoCampoClave = 'text';
    } else {
      this.cambiarTipoCampoClave = 'password';
    }
  }

  visualizarNuevaClave() {
    if (this.cambiarTipoCampoNuevaClave === 'password') {
      this.cambiarTipoCampoNuevaClave = 'text';
    } else {
      this.cambiarTipoCampoNuevaClave = 'password';
    }
  }

  visualizarConfirmarNuevaClave() {
    if (this.cambiarTipoCampoConfirmarNuevaClave === 'password') {
      this.cambiarTipoCampoConfirmarNuevaClave = 'text';
    } else {
      this.cambiarTipoCampoConfirmarNuevaClave = 'password';
    }
  }

  initForm() {
    this.formularioCambioClave = this.formBuilder.group(
      {
        nuevaClave: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        confirmarNuevaClave: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
      },
      {
        validator: [
          ConfirmPasswordValidator.validarCambioClave,
        ],
      }
    );
  }

  get formFields() {
    return this.formularioCambioClave.controls;
  }
  submit() {
    if (this.formularioCambioClave.valid) {
      this.authService
        .cambiarClave(this.codigoUsuario, this.formFields.nuevaClave.value)
        .subscribe((respuesta) => {
          this.alertaService.mensajaExitoso('Se actualizó la información');
          this.modalService.dismissAll();
        });
    } else {
      this.formularioCambioClave.markAllAsTouched();
    }
  }

  open() {
    this.formularioCambioClave.reset();
    this.modalRef = this.modalService.open(this.customTemplate, { backdrop: 'static' });
  }

}
