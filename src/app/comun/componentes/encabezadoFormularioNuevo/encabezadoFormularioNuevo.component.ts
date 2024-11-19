import { Component, Input } from '@angular/core';
import { BtnAtrasComponent } from '../btn-atras/btn-atras.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-comun-encabezado-formulario-nuevo',
  standalone: true,
  imports: [BtnAtrasComponent, TranslateModule],
  templateUrl: './encabezadoFormularioNuevo.component.html',
  styleUrl: './encabezadoFormularioNuevo.component.scss',
})
export class EncabezadoFormularioNuevoComponent {
  @Input() estadoAprobado: boolean = false;
  @Input() btnNuevoCargando: boolean | null = false;
}
