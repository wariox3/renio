import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import {
  obtenerUsuarioCorreo,
  obtenerUsuarioFechaCreacion,
  obtenerUsuarioId,
  obtenerUsuarioVerificado,
} from '@redux/selectors/usuario.selectors';
import { TranslateModule } from '@ngx-translate/core';

import { RouterModule } from '@angular/router';
import {
  combineLatest,
  interval,
  of,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@modulos/auth';
import { usuarioActionActualizarEstadoVerificado } from '@redux/actions/usuario.actions';

@Component({
  selector: 'app-comun-alerta-activar-cuenta',
  templateUrl: './alerta-activar-cuenta.component.html',
  imports: [CommonModule, TranslateModule, RouterModule],
  standalone: true,
})
export class AlertaActivarCuentaComponent extends General implements OnInit {
  visualizarAlerta = false;
  visualizarMensajeCorreoEnviado = false;
  usuarioFechaLimitePago: Date;
  usuarioFechaLimiteActivarCuenta: Date = new Date();
  usuarioVrSaldo = '';
  usuarioCorreo = '';
  usuarioId = '';
  timeLeft: number = 180;
  private subscription: Subscription = new Subscription();

  constructor(
    private modalService: NgbModal,
    private contenedorService: ContenedorService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit() {
    combineLatest([
      this.store.select(obtenerUsuarioVerificado),
      this.store.select(obtenerUsuarioFechaCreacion),
      this.store.select(obtenerUsuarioCorreo),
      this.store.select(obtenerUsuarioId),
    ])
      .pipe(
        tap((respuesta: any) => {
          this.visualizarAlerta = respuesta[0];
          this.usuarioFechaLimitePago = new Date(respuesta[1]);
          this.usuarioCorreo = respuesta[2];
          this.usuarioId = respuesta[3];
          this.usuarioFechaLimiteActivarCuenta.setHours(
            this.usuarioFechaLimitePago.getHours() + 3
          );
        }),
        switchMap(() => {
          if (!this.visualizarAlerta) {
            return this.authService.consultarEstadoVerificado(this.usuarioId);
          }
          return of(null);
        }),
        tap((respuestaEstadoVerificado: any) => {
          if (respuestaEstadoVerificado !== null) {
            if (respuestaEstadoVerificado.verificado) {
              this.store.dispatch(
                usuarioActionActualizarEstadoVerificado({
                  estado_verificado: true,
                })
              );
              this.visualizarAlerta = true
              this.changeDetectorRef.detectChanges();
            }
          }
        })
      )
      .subscribe();
    this.changeDetectorRef.detectChanges();
  }

  abrirModal(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.changeDetectorRef.detectChanges();
  }

  reenviarCorreo() {
    this.visualizarMensajeCorreoEnviado = true;
    const source = interval(1000); // Intervalo de 1 segundo
    this.contenedorService
      .reenviarCorreoVerificacion(this.usuarioId)
      .subscribe((respuesta) => {
        this.subscription = source.subscribe((val) => this.tick());
      });
    this.changeDetectorRef.detectChanges();
  }

  displayTimeLeft(): string {
    const minutes: number = Math.floor(this.timeLeft / 60);
    const seconds: number = this.timeLeft % 60;
    return `Tiempo restante: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  tick() {
    if (this.timeLeft > 0) {
      this.timeLeft--;
    } else {
      this.subscription.unsubscribe();
      this.visualizarMensajeCorreoEnviado = false;
      this.changeDetectorRef.detectChanges();
    }
  }
}
