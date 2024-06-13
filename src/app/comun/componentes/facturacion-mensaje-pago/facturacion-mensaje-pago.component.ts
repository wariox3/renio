import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-facturacion-estado',
  standalone: true,
  templateUrl: './facturacion-mensaje-pago.component.html',
  styleUrls: ['./facturacion-mensaje-pago.component.scss'],
  imports: [CommonModule, CardComponent, TranslateModule, TranslationModule, RouterModule],
})
export class FacturacionMensajePagoComponent {}
