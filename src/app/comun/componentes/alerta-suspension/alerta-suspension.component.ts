import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import {
  obtenerUsuarioFechaLimitePago,
  obtenerUsuarioSuspencion,
  obtenerUsuarioVrSaldo,
} from '@redux/selectors/usuario.selectors';
import { TranslateModule } from '@ngx-translate/core';

import { RouterModule } from '@angular/router';
import { combineLatest, combineLatestAll } from 'rxjs';

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
      this.usuarioFechaLimitePago.setDate(this.usuarioFechaLimitePago.getDate() + 1);
      this.usuarioVrSaldo = respuesta[2];
    });
    this.changeDetectorRef.detectChanges();
  }

  navegar() {
    this.router.navigate([`/facturacion`]);
  }
}
