import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertaService } from '@comun/services/alerta.service';
import { AuthService } from '@modulos/auth/services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-verificacion-cuenta',
  templateUrl: './verificacion-cuenta.component.html',
  styleUrls: ['./verificacion-cuenta.component.scss'],
})
export class VerificacionCuentaComponent implements OnInit {

  verificacionToken: ('exitosa'|'error'|'cargando') = 'cargando';
  verficacionErrorMensaje = ""
  codigoUsuario: number | null = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private alertaService: AlertaService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.consultarValidacion()
  }

  consultarValidacion() {
    const token = this.activatedRoute.snapshot.paramMap.get('token')!;
    this.authService.validacion(token).subscribe({
      next: (): void => {
        this.alertaService.mensajaExitoso(
          'Verificación correcta',
          'Por favor iniciar sesión'
        );
        this.verificacionToken = 'exitosa';
        this.changeDetectorRef.detectChanges();

      },
      error: ({ error }) => {
        this.verificacionToken = 'error';
        this.verficacionErrorMensaje = error.mensaje;
        if (error.codigo != 4) {
          this.codigoUsuario = error.codigoUsuario;
        }
        this.alertaService.mensajeError(
          'Error en la verificación',
          `Código: ${error.codigo} <br/> Mensaje: ${error.mensaje}`
        );
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  login() {
    this.router.navigate(['/auth/login']);
  }

  reenviarVerificacion() {
    if (this.codigoUsuario) {
      this.authService.reenviarValidacion(this.codigoUsuario).subscribe({
        next: (respuesta): void => {
          this.alertaService.mensajaExitoso(
            'Nueva verificación creada',
            `La nueva verificación se ha enviado nuevamente al correo electrónico registrado. <br> Vence: ${respuesta.verificacion.vence}`
          );
        },
        error: ({ error }): void => {
          this.alertaService.mensajeError(
            'Error en la verificación',
            `Código: ${error.codigo} <br/> Mensaje: ${error.mensaje}`
          );
        },
      });
    }
  }
}
