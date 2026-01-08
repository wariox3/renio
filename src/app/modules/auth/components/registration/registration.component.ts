import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { General } from '@comun/clases/general';
import { ConfirmPasswordValidator } from '@comun/validaciones/confirm-password.validator';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { InputValueCaseDirective } from '@comun/directive/input-value-case.directive';
import { environment } from '@env/environment';
import { NgxTurnstileComponent, NgxTurnstileModule } from 'ngx-turnstile';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgClass,
    NgTemplateOutlet,
    NgIf,
    RouterLink,
    InputValueCaseDirective,
    NgxTurnstileModule,
  ],
})
export class RegistrationComponent extends General implements OnInit {
  @ViewChild(NgxTurnstileComponent) turnstileComponent!: NgxTurnstileComponent;
  formularioRegistro: FormGroup;
  cambiarTipoCampoClave: 'text' | 'password' = 'password';
  cambiarTipoCampoConfirmarClave: 'text' | 'password' = 'password';
  visualizarLoader: boolean = false;
  turnstileToken: string = '';
  turnstileSiteKey: string = environment.turnstileSiteKey;
  isProduction: boolean = environment.production;
  enableTurnstile: boolean = environment.enableTurnstile;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
  }

  onSuccess(token: any) {
    this.turnstileToken = token;
    this.formularioRegistro.get('turnstileToken')?.setValue(token);
    this.changeDetectorRef.detectChanges();
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
    this.formularioRegistro = this.formBuilder.group(
      {
        usuario: [
          '',
          Validators.compose([
            Validators.required,
            Validators.email,
            Validators.minLength(3),
            Validators.maxLength(50),
            Validators.pattern(/^[a-z-A-Z-0-9@.-_]+$/),
          ]),
        ],
        clave: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(50),
            Validators.pattern(/^[a-z-A-Z-0-9@.-_*]+$/),
          ]),
        ],
        confirmarClave: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(50),
            Validators.pattern(/^[a-z-A-Z-0-9@.-_*]+$/),
          ]),
        ],
        terminosCondiciones: [
          false,
          Validators.compose([Validators.requiredTrue]),
        ],
        turnstileToken: [''],
        proyecto: 'REDDOC',
      },
      {
        validator: ConfirmPasswordValidator.validarClave,
      },
    );

    if (this.enableTurnstile) {
      this.formularioRegistro
        .get('turnstileToken')
        ?.addValidators([Validators.required]);
    }
  }

  get formFields() {
    return this.formularioRegistro.controls;
  }

  submit() {
    if (this.formularioRegistro.valid) {
      this.visualizarLoader = true;
      this.authService
        .registration(this.formularioRegistro.value)
        .pipe(
          switchMap(() =>
            this.authService.login(
              this.formFields.usuario.value,
              this.formFields.clave.value,
              this.enableTurnstile ? this.formFields.turnstileToken.value : undefined,
            ),
          ),
          tap((respuestaLogin) => {
            this.authService.loginExitoso(respuestaLogin.user);
          }),
          catchError(() => {
            this.visualizarLoader = false;
            if (this.enableTurnstile && this.turnstileComponent) {
              this.turnstileComponent.reset();
              this.turnstileToken = '';
              this.formularioRegistro.get('turnstileToken')?.setValue('');
            }
            this.changeDetectorRef.detectChanges();
            return of(null);
          }),
        )
        .subscribe();
    } else {
      this.formularioRegistro.markAllAsTouched();
    }
  }
}
