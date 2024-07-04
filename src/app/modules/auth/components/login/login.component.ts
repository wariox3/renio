import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription, Observable, switchMap, tap, of, catchError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { usuarioActionInit } from '@redux/actions/usuario.actions';
import { General } from '@comun/clases/general';
import { SubdominioService } from '@comun/services/subdominio.service';
import { configuracionVisualizarAction } from '@redux/actions/configuracion.actions';
import { environment } from '@env/environment';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { NgIf, NgClass, NgTemplateOutlet } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

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
    ],
})
export class LoginComponent extends General implements OnInit, OnDestroy {
  // KeenThemes mock, change it to:
  defaultAuth: any = {
    email: '',
    password: '',
  };
  loginForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;
  visualizarLoader: boolean = false;
  cambiarTipoCampoClave: 'text' | 'password' = 'password';

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private subdominioService: SubdominioService
  ) {
    super();
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  visualizarClave() {
    if (this.cambiarTipoCampoClave === 'password') {
      this.cambiarTipoCampoClave = 'text';
    } else {
      this.cambiarTipoCampoClave = 'password';
    }
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
          Validators.pattern(/^[a-z-A-Z-0-9@.-_*]+$/),
        ]),
      ],
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
        .login(this.f.email.value, this.f.password.value)
        .pipe(
          tap((respuesta) => {
            //actualizar el store de redux
            this.store.dispatch(
              usuarioActionInit({
                usuario: {
                  id: respuesta.user.id,
                  username: respuesta.user.username,
                  imagen: respuesta.user.imagen,
                  nombre_corto: respuesta.user.nombre_corto,
                  nombre: respuesta.user.nombre,
                  apellido: respuesta.user.apellido,
                  telefono: respuesta.user.telefono,
                  correo: respuesta.user.correo,
                  idioma: respuesta.user.idioma,
                  dominio: respuesta.user.dominio,
                  fecha_limite_pago: new Date(respuesta.user.fecha_limite_pago),
                  vr_saldo: respuesta.user.vr_saldo,
                  fecha_creacion: new Date(respuesta.user.fecha_creacion),
                  verificado: respuesta.user.verificado
                },
              })
            );
            if (window.location.host.includes(environment.dominioApp)) {
              this.store.dispatch(
                configuracionVisualizarAction({
                  configuracion: {
                    visualizarApps: true,
                  },
                })
              );
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/contenedor/lista']);
            }
          }),
          switchMap((respuesta) => {
            if (this.subdominioService.esSubdominioActual()) {
              this.consultarInformacionEmpresa(
                respuesta.user.id,
                this.subdominioService.subdominioNombre()
              );
            }
            return of(null);
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
                    'FORMULARIOS.MENSAJES.CONTENEDOR.INVITACIONACEPTADA'
                  )
                );
              }
            }
          }),
          catchError(() => {
            this.visualizarLoader = false;
            this.changeDetectorRef.detectChanges();
            return of(null);
          })
        )
        .subscribe();
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  consultarInformacionEmpresa(empresa_id: string, empresa_nombre: string) {
    // this.empresaService
    // .consultarInformacion(this.empresa_id)
    // .subscribe((respuesta: any) => {
    //   this.informacionEmpresa = respuesta;
    //   this.changeDetectorRef.detectChanges();
    // });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
