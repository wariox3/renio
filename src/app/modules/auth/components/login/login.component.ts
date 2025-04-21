import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { General } from '@comun/clases/general';
import { InputValueCaseDirective } from '@comun/directive/input-value-case.directive';
import { SubdominioService } from '@comun/services/subdominio.service';
import { environment } from '@env/environment';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';
import { TranslateModule } from '@ngx-translate/core';
import { configutacionActionInit } from '@redux/actions/configuracion.actions';
import { usuarioActionInit } from '@redux/actions/usuario.actions';
import { catchError, Observable, of, Subscription, switchMap, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgIf,
    NgClass,
    NgTemplateOutlet,
    RouterLink,
    InputValueCaseDirective,
  ],
})
export class LoginComponent extends General implements OnInit, OnDestroy {
  defaultAuth: any = {
    email: '',
    password: '',
  };
  loginForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;
  visualizarLoader: boolean = false;
  cambiarTipoCampoClave: 'text' | 'password' = 'password';
  turnstileToken: string = '';
  turnstileSiteKey: string = environment.turnstileSiteKey;
  private turnstileLoaded: boolean = false;

  private unsubscribe: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private subdominioService: SubdominioService,
    private contenedorServices: ContenedorService,
  ) {
    super();
    this.isLoading$ = this.authService.isLoading$;
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
    this.loginForm.get('turnstileToken')?.setValue('');
    localStorage.removeItem('cf-turnstile-response');
    sessionStorage.removeItem('cf-turnstile-response');
  }

  // Cargar el script de Turnstile dinámicamente
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
    this.loginForm.get('turnstileToken')?.setValue(token);
    this.changeDetectorRef.detectChanges();
  }

  onTurnstileError(): void {
    console.error('Error en Turnstile');
    this.turnstileToken = '';
    this.loginForm.get('turnstileToken')?.setValue('');
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

  get f() {
    return this.loginForm.controls;
  }

  visualizarClave() {
    this.cambiarTipoCampoClave =
      this.cambiarTipoCampoClave === 'password' ? 'text' : 'password';
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
          Validators.minLength(3),
          Validators.maxLength(320),
          Validators.pattern(/^[a-z-A-Z-0-9@.-_]+$/),
        ]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
      turnstileToken: ['', Validators.required],
    });
  }

  submit() {
    const tokenUrl = this.activatedRoute.snapshot.paramMap.get('token');
    if (Swal.isVisible()) {
      Swal.close();
    }

    if (this.loginForm.valid) {
      this.visualizarLoader = true;
      this.authService
        .login(
          this.f.email.value,
          this.f.password.value,
          this.f.turnstileToken.value,
        )
        .pipe(
          tap((respuestaLogin) => {
            this.store.dispatch(
              usuarioActionInit({
                usuario: {
                  id: respuestaLogin.user.id,
                  username: respuestaLogin.user.username,
                  imagen: respuestaLogin.user.imagen,
                  nombre_corto: respuestaLogin.user.nombre_corto,
                  nombre: respuestaLogin.user.nombre,
                  apellido: respuestaLogin.user.apellido,
                  telefono: respuestaLogin.user.telefono,
                  correo: respuestaLogin.user.correo,
                  idioma: respuestaLogin.user.idioma,
                  dominio: respuestaLogin.user.dominio,
                  fecha_limite_pago: new Date(
                    respuestaLogin.user.fecha_limite_pago,
                  ),
                  vr_saldo: respuestaLogin.user.vr_saldo,
                  fecha_creacion: new Date(respuestaLogin.user.fecha_creacion),
                  verificado: respuestaLogin.user.verificado,
                  es_socio: respuestaLogin.user.es_socio,
                  socio_id: respuestaLogin.user.socio_id,
                  is_active: respuestaLogin.user.is_active,
                  numero_identificacion:
                    respuestaLogin.user.numero_identificacion,
                  cargo: respuestaLogin.user.cargo,
                },
              }),
            );
          }),
          tap(() => {
            this.store.dispatch(
              configutacionActionInit({
                configuracion: {
                  visualizarApps: false,
                  visualizarBreadCrumbs: false,
                },
              }),
            );
            this.router.navigate(['/contenedor/lista']);
          }),
          switchMap(() => {
            if (tokenUrl) {
              return this.authService.confirmarInivitacion(tokenUrl);
            }
            return of(null);
          }),
          tap((respuestaConfirmarInivitacion: any) => {
            if (tokenUrl) {
              if (respuestaConfirmarInivitacion.confirmar) {
                this.alertaService.mensajaExitoso(
                  this.translateService.instant(
                    'FORMULARIOS.MENSAJES.CONTENEDOR.INVITACIONACEPTADA',
                  ),
                );
              }
            }
          }),
          catchError(() => {
            this.visualizarLoader = false;
            this.changeDetectorRef.detectChanges();
            return of(null);
          }),
        )
        .subscribe();
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    window.onTurnstileSuccess = () => {};
    window.onTurnstileError = () => {};
  }

}
