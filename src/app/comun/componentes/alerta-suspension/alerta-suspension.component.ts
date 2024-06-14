import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import {
  obtenerUsuarioFechaLimitePago,
  obtenerUsuarioSuspencion,
} from '@redux/selectors/usuario.selectors';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-comun-alerta-suspension',
  templateUrl: './alerta-suspension.component.html',
  imports: [CommonModule, TranslateModule, TranslationModule, RouterModule],
  standalone: true,
})
export class AlertaSuspensionComponent extends General implements OnInit {
  visualerSuspencion = false;

  usuarioFechaLimitePago$ = this.store.select(obtenerUsuarioFechaLimitePago);

  constructor() {
    super();
  }

  ngOnInit() {
    this.store.select(obtenerUsuarioSuspencion).subscribe((respuesta) => {
      this.visualerSuspencion = respuesta;
    });
    this.changeDetectorRef.detectChanges();
  }

  navegar() {
    this.router.navigate([`/profile/facturacion`]);
  }
}
