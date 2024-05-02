import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-pago-formulario',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './pago-formulario.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PagoFormularioComponent { }
