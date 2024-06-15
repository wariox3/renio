import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import {
  obtenerUsuarioFechaLimitePago,
  obtenerUsuarioSuspencion,
  obtenerUsuarioVrSaldo,
} from '@redux/selectors/usuario.selectors';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { RouterModule } from '@angular/router';
import { combineLatest, combineLatestAll } from 'rxjs';

@Component({
  selector: 'app-comun-alerta-suspension',
  templateUrl: './alerta-suspension.component.html',
  imports: [CommonModule, TranslateModule, TranslationModule, RouterModule],
  standalone: true,
})
export class AlertaSuspensionComponent extends General implements OnInit {
  visualizarAlerta = false;
  usuarioFechaLimitePago: Date;
  usuarioVrSaldo = '';

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
      this.usuarioVrSaldo = respuesta[2];

      console.log(typeof(respuesta[1]));

    });
    this.changeDetectorRef.detectChanges();
  }

  navegar() {
    this.router.navigate([`/facturacion`]);
  }
}
