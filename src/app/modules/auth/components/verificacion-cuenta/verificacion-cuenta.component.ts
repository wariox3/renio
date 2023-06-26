import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertaService } from '@comun/services/alerta.service';
import { AuthService } from '@modulos/auth/services/auth.service';


@Component({
  selector: 'app-verificacion-cuenta',
  templateUrl: './verificacion-cuenta.component.html',
  styleUrls: ['./verificacion-cuenta.component.scss'],
})
export class VerificacionCuentaComponent implements OnInit {
  visualizarBtnReenviarVerificacion = false;
  codigoUsuario: number | null = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    const token = this.activatedRoute.snapshot.paramMap.get('token')!;
    this.authService.validacion(token).subscribe({
      next: (): void => {
        this.alertaService.mensajaExitoso(
          'Verificación correcta',
          'Por favor iniciar sesión'
        );
        this.router.navigate(['/auth/login']);
      },
      error: ({ error }): void => {
        if (error.codigo != 4) {
          this.visualizarBtnReenviarVerificacion = true;
          this.codigoUsuario = error.codigoUsuario;
        }
        this.alertaService.mensajeError(
          'Error verificación',
          `Código: ${error.codigo} <br/> Mensaje: ${error.mensaje}`
        );
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
            'Nueva verificación creada ',
            `La nueva verificación se ha enviado al correo electrónico registrado. <br> Vence: ${respuesta.verificacion.vence}`
          );
          this.router.navigate(['/auth/login']);
        },
        error: ({ error }): void => {
          this.alertaService.mensajeError(
            'Error verificación',
            `Código: ${error.codigo} <br/> Mensaje: ${error.mensaje}`
          );
        },
      });
    }
  }
}
