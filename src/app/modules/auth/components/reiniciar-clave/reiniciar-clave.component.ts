import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@modulos/auth/services/auth.service';
import { ConfirmPasswordValidator } from '@comun/validaciones/confirm-password.validator';
import { General } from '@comun/clases/general';
import { catchError, of, tap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { NgClass, NgTemplateOutlet, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    templateUrl: './reiniciar-clave.component.html',
    styleUrls: ['./reiniciar-clave.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        NgClass,
        NgTemplateOutlet,
        NgIf,
        RouterLink,
    ],
})
export class ReiniciarClaveComponent extends General implements OnInit {
  codigo_usuario: string = '';
  inhabilitarBtnRestablecer: boolean = true;
  formularioReiniciarClave: FormGroup;
  cambiarTipoCampoClave: 'text' | 'password' = 'password';
  cambiarTipoCampoConfirmarClave: 'text' | 'password' = 'password';
  visualizarLoader: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.validarToken();
  }

  visualizarClave() {
    if (this.cambiarTipoCampoClave === 'password') {
      this.cambiarTipoCampoClave = 'text';
    } else {
      this.cambiarTipoCampoClave = 'password';
    }
  }

  visualizarConfirmarClave() {
    if (this.cambiarTipoCampoConfirmarClave === 'password') {
      this.cambiarTipoCampoConfirmarClave = 'text';
    } else {
      this.cambiarTipoCampoConfirmarClave = 'password';
    }
  }

  initForm() {
    this.formularioReiniciarClave = this.formBuilder.group(
      {
        clave: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        confirmarClave: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
      },
      {
        validator: ConfirmPasswordValidator.validarClave,
      }
    );
  }

  validarToken() {
    this.inhabilitarBtnRestablecer = false;
  }

  get formFields() {
    return this.formularioReiniciarClave.controls;
  }

  submit() {
    if (this.formularioReiniciarClave.valid) {
      this.visualizarLoader = true;
      const token = this.activatedRoute.snapshot.paramMap.get('token')!;
      this.authService
        .reiniciarClave(this.formFields.clave.value, token)
        .pipe(
          tap(() => {
            this.alertaService.mensajaExitoso(
              this.translateService.instant(
                'FORMULARIOS.MENSAJES.AUTENTIFICACION.INGRESARCLAVE'
              )
            );
            this.router.navigate(['/auth/login']);
          }),
          catchError(() => {
            this.visualizarLoader = false;
            this.changeDetectorRef.detectChanges();
            return of(null);
          })
        )
        .subscribe();
    } else {
      this.formularioReiniciarClave.markAllAsTouched();
    }
  }
}
