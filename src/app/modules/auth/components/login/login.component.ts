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
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';

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
    private subdominioService: SubdominioService,
    private contenedorServices: ContenedorService
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
          tap((respuestaLogin) => {
            //actualizar el store de redux
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
                    respuestaLogin.user.fecha_limite_pago
                  ),
                  vr_saldo: respuestaLogin.user.vr_saldo,
                  fecha_creacion: new Date(respuestaLogin.user.fecha_creacion),
                  verificado: respuestaLogin.user.verificado,
                  es_socio: respuestaLogin.user.es_socio,
                  socio_id: respuestaLogin.user.socio_id,
                },
              })
            );
          }),
          switchMap(() => {
            if (this.subdominioService.esSubdominioActual()) {
              return this.contenedorServices.varios(
                this.subdominioService.subdominioNombre()
              );
            }
            return of(null);
          }),
          tap((respuesta: any) => {
            console.log(respuesta);

            if (respuesta?.empresa.acceso_restringido) {
              this.validarSubdominioYrediccionar();
            } else {
              this.router.navigate(['/contenedor/lista']);
            }
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

  validarSubdominioYrediccionar() {
    if (this.subdominioService.esSubdominioActual()) {
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
