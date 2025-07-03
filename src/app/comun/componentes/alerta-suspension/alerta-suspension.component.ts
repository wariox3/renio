import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { TranslateModule } from '@ngx-translate/core';
import {
  obtenerUsuarioFechaLimitePago,
  obtenerUsuarioId,
  obtenerUsuarioSuspencion,
  obtenerUsuarioVrSaldo,
} from '@redux/selectors/usuario.selectors';

import { RouterModule } from '@angular/router';
import { FacturacionService } from '@modulos/facturacion/servicios/facturacion.service';
import { usuarioActionActualizarVrSaldo } from '@redux/actions/usuario.actions';
import { combineLatest, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-comun-alerta-suspension',
  templateUrl: './alerta-suspension.component.html',
  imports: [CommonModule, TranslateModule, RouterModule],
  standalone: true,
})
export class AlertaSuspensionComponent extends General implements OnInit {
  visualizarAlerta = false;
  usuarioFechaLimitePago: Date;
  usuarioVrSaldo: number;
  hoy: Date = new Date();
  private _facturacionService = inject(FacturacionService);

  constructor() {
    super();
  }

  ngOnInit() {
    combineLatest([
      this.store.select(obtenerUsuarioSuspencion),
      this.store.select(obtenerUsuarioFechaLimitePago),
      this.store.select(obtenerUsuarioVrSaldo),
    ]).subscribe((respuesta: any) => {
      this.visualizarAlerta = respuesta[0];
      this.usuarioFechaLimitePago = new Date(respuesta[1]);
      this.usuarioFechaLimitePago.setDate(
        this.usuarioFechaLimitePago.getDate() + 1,
      );
      this.usuarioVrSaldo = respuesta[2];
    });
    this.changeDetectorRef.detectChanges();
  }

  navegar() {
    this.router.navigate([`/facturacion`]);
  }

  actualizarPago() {
    this.store
      .select(obtenerUsuarioId)
      .pipe(
        switchMap((respuestaUsuarioId) =>
          this._facturacionService.obtenerUsuarioVrSaldo(respuestaUsuarioId),
        ),
        tap((respuesta) => {
          if (respuesta.saldo > 0) {
            this.alertaService.mensajeInformativo(
              'Información',
              `El usuario aún cuenta con pagos pendientes. Si ya realizó el pago, por favor comuníquese con nuestro equipo de soporte al WhatsApp 333 2590638`,
            );
          } else {
            this.store.dispatch(
              usuarioActionActualizarVrSaldo({
                vr_saldo: 0,
              }),
            );
            this.visualizarAlerta = false;
            this.changeDetectorRef.detectChanges();
          }
        }),
      )
      .subscribe();
  }
}
