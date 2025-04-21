import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

declare global {
  interface Window {
    onTurnstileSuccess: (token: string) => void;
    onTurnstileError: () => void;
    turnstile?: {
      render: (
        container: string,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'error-callback': () => void;
          'refresh-expired'?: string;
        },
      ) => void;
      reset?: (container: string) => void;
    };
  }
}

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
  ],
})
export class RegistrationComponent extends General implements OnInit {
  formularioRegistro: FormGroup;
  cambiarTipoCampoClave: 'text' | 'password' = 'password';
  cambiarTipoCampoConfirmarClave: 'text' | 'password' = 'password';
  visualizarLoader: boolean = false;
  turnstileToken: string = '';
  turnstileSiteKey: string = environment.turnstileSiteKey;
  private turnstileLoaded: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.resetTurnstileState();
    this.loadTurnstileScript();
    window.onTurnstileSuccess = (token: string) => this.onTurnstileSuccess(token);
    window.onTurnstileError = () => this.onTurnstileError();
  }

  private resetTurnstileState(): void {
    this.turnstileToken = '';
    this.formularioRegistro.get('turnstileToken')?.setValue('');
    localStorage.removeItem('cf-turnstile-response');
    sessionStorage.removeItem('cf-turnstile-response');
  }

  private loadTurnstileScript(): void {
    if (this.turnstileLoaded || typeof document === 'undefined') return;
    
    if (document.querySelector('script[src*="cloudflare.com/turnstile"]')) {
      this.turnstileLoaded = true;
      this.resetTurnstileWidget();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.turnstileLoaded = true;
      this.resetTurnstileWidget();
    };
    script.onerror = () => {
      console.error('Error al cargar Turnstile');
      this.onTurnstileError();
    };
    document.head.appendChild(script);
  }

  onTurnstileSuccess(token: string): void {
    if (!token) return;
    this.turnstileToken = token;
    this.formularioRegistro.get('turnstileToken')?.setValue(token);
    this.changeDetectorRef.detectChanges();
  }

  onTurnstileError(): void {
    console.error('Error en Turnstile');
    this.turnstileToken = '';
    this.formularioRegistro.get('turnstileToken')?.setValue('');
    this.changeDetectorRef.detectChanges();
  }

  resetTurnstileWidget() {
    const container = document.querySelector('.cf-turnstile');
    if (container) {
      // Usar reset si está disponible
      if (window.turnstile?.reset) {
        window.turnstile.reset('.cf-turnstile');
      } else {
        container.innerHTML = '';
      }
      
      setTimeout(() => {
        if (window.turnstile) {
          window.turnstile.render('.cf-turnstile', {
            sitekey: this.turnstileSiteKey,
            callback: (token: string) => this.onTurnstileSuccess(token),
            'error-callback': () => this.onTurnstileError(),
            'refresh-expired': 'auto'
          });
        }
      }, 100);
    }
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
        turnstileToken: ['', Validators.required],
      },
      {
        validator: ConfirmPasswordValidator.validarClave,
      },
    );
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
              this.formFields.turnstileToken.value,
            ),
          ),
          tap((respuestaLogin) => {
            this.authService.loginExitoso(respuestaLogin.user);
          }),
          catchError(() => {
            this.visualizarLoader = false;
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
