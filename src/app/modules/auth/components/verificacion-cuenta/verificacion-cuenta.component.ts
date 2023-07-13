import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertaService } from '@comun/services/alerta.service';
import { AuthService } from '@modulos/auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { General } from '@comun/clases/general';

@Component({
  selector: 'app-verificacion-cuenta',
  templateUrl: './verificacion-cuenta.component.html',
  styleUrls: ['./verificacion-cuenta.component.scss'],
})
export class VerificacionCuentaComponent extends General implements OnInit {
  verificacionToken: 'exitosa' | 'error' | 'cargando' = 'cargando';
  verficacionErrorMensaje = '';
  codigoUsuario: number | null = null;

  constructor(private authService: AuthService) {
    super();
  }

  ngOnInit(): void {
    this.consultarValidacion();
  }

  consultarValidacion() {
    const token = this.activatedRoute.snapshot.paramMap.get('token')!;
    this.authService.validacion(token).subscribe({
      next: (): void => {
        this.alertaService.mensajaExitoso(
          this.translateService.instant('')
          //'Por favor iniciar sesión'
        );
        this.verificacionToken = 'exitosa';
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.verificacionToken = 'error';
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
            this.translateService.instant("")
            //`La nueva verificación se ha enviado nuevamente al correo electrónico registrado. <br> Vence: ${respuesta.verificacion.vence}`
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
