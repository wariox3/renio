import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
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
import {
  usuarioActionActualizarVrCredito,
  usuarioActionActualizarVrSaldo,
} from '@redux/actions/usuario.actions';
import { combineLatest, Subject, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-comun-alerta-suspension',
  templateUrl: './alerta-suspension.component.html',
  imports: [CommonModule, TranslateModule, RouterModule],
  standalone: true,
})
export class AlertaSuspensionComponent
  extends General
  implements OnInit, OnDestroy
{
  visualizarAlerta = false;
  usuarioFechaLimitePago: Date;
  usuarioVrSaldo: number;
  hoy: Date = new Date();
  usuarioID = 0;
  private _unsubscribe$ = new Subject<void>();
  private _facturacionService = inject(FacturacionService);

  constructor() {
    super();
  }

  ngOnInit() {
    combineLatest([
      this.store.select(obtenerUsuarioSuspencion),
      this.store.select(obtenerUsuarioFechaLimitePago),
      this.store.select(obtenerUsuarioVrSaldo),
      this.store.select(obtenerUsuarioId),
    ])
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((respuesta) => {
        this.visualizarAlerta = respuesta[0];
        this.usuarioFechaLimitePago = new Date(respuesta[1]);
        this.usuarioFechaLimitePago.setDate(
          this.usuarioFechaLimitePago.getDate() + 1,
        );
        this.usuarioVrSaldo = respuesta[2];
        this.usuarioID = respuesta[3];
      });

    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  navegar() {
    this.router.navigate([`/facturacion`]);
  }

  actualizarPago() {
    this._facturacionService
      .obtenerUsuarioVrSaldo(this.usuarioID)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((respuesta) => {
        if (respuesta.saldo > 0) {
          this.alertaService.mensajeInformativo(
            'Información',
            `El usuario aún cuenta con pagos pendientes. Si ya realizó el pago, por favor comuníquese con nuestro equipo de soporte al WhatsApp 333 2590638`,
          );
        } else {
          this.visualizarAlerta = false;
        }
        this.store.dispatch(
          usuarioActionActualizarVrSaldo({
            vr_saldo: respuesta.saldo,
          }),
        );
        this.store.dispatch(
          usuarioActionActualizarVrCredito({
            vr_credito: respuesta.credito,
          }),
        );
        this.changeDetectorRef.detectChanges();
      });
  }
}
