import { ChangeDetectorRef, Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertaService } from '@comun/services/alerta.service';
import { ConfirmPasswordValidator } from '@comun/validaciones/confirm-password.validator';
import { AuthService } from '@modulos/auth';
import { Store } from '@ngrx/store';
import { obtenerId } from '@redux/selectors/usuario-id.selectors';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-seguridad-cambio-clave',
  templateUrl: './cambio-clave.component.html',
  styleUrls: ['./cambio-clave.component.scss'],
})

export class CambioClaveComponent implements OnInit {
  codigoUsuario = '';
  formularioCambioClave: FormGroup;
  cambiarTipoCampoClave: 'text' | 'password' = 'password';
  cambiarTipoCampoNuevaClave: 'text' | 'password' = 'password';
  cambiarTipoCampoConfirmarNuevaClave: 'text' | 'password' = 'password';
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;
  modalRef: any;

  constructor(
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private store: Store,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.store.select(obtenerId).subscribe((codigoUsuario) => {
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
        .reiniciarClave(this.codigoUsuario, this.formFields.nuevaClave.value)
        .subscribe((respuesta) => {
          this.alertaService.mensajaExitoso(
            'Actualización exitosa',
            `Recuerde iniciar sesion con su nueva contraseña`
          );
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
