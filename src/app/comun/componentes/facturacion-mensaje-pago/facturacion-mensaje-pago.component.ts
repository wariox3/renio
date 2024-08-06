import { FacturacionService } from '@modulos/facturacion/servicios/facturacion.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { TranslateModule } from '@ngx-translate/core';

import { RouterModule } from '@angular/router';
import { General } from '@comun/clases/general';
import {
  obtenerUsuarioId,
  obtenerValidacionSaldo,
} from '@redux/selectors/usuario.selectors';
import { of, switchMap, tap } from 'rxjs';
import { usuarioActionActualizarVrSaldo } from '@redux/actions/usuario.actions';

@Component({
  selector: 'app-facturacion-estado',
  standalone: true,
  templateUrl: './facturacion-mensaje-pago.component.html',
  styleUrls: ['./facturacion-mensaje-pago.component.scss'],
  imports: [
    CommonModule,
    CardComponent,
    TranslateModule,
    RouterModule,
],
})
export class FacturacionMensajePagoComponent extends General implements OnInit {
  procesando = true;
  vr_saldo: number;

  constructor(private facturacionService: FacturacionService) {
    super();
  }

  ngOnInit(): void {
    const isFirstTime = !localStorage.getItem('isFirstTime');

    if (isFirstTime) {
      localStorage.setItem('isFirstTime', 'false');
      setTimeout(() => {
        this.procesando = false;
        this.changeDetectorRef.detectChanges();
        this.consultarInformacion();
      }, 5000);
    } else {
      this.procesando = false;
      this.changeDetectorRef.detectChanges();
      this.consultarInformacion();
    }
  }

  consultarInformacion() {
    this.store
      .select(obtenerUsuarioId)
      .pipe(
        switchMap((respuestaUsuarioId) =>
          this.facturacionService.obtenerUsuarioVrSaldo(respuestaUsuarioId)
        ),
        switchMap((respuestaUsuarioVrSaldo) => {
          this.vr_saldo = respuestaUsuarioVrSaldo.saldo;
          this.changeDetectorRef.detectChanges();
          return this.store.select(
            obtenerValidacionSaldo(respuestaUsuarioVrSaldo.saldo)
          );
        }),
        tap((respuestaUsuarioValidarSaldo) => {
          if (respuestaUsuarioValidarSaldo) {
            this.store.dispatch(
              usuarioActionActualizarVrSaldo({
                vr_saldo: this.vr_saldo,
              })
            );
            this.changeDetectorRef.detectChanges();
            location.reload();
          }
          of(null);
        })
      )
      .subscribe();
    this.changeDetectorRef.detectChanges();
  }

}
