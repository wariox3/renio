import { Component, Input } from '@angular/core';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-comun-encabezado-formulario-nuevo',
  standalone: true,
  imports: [BtnAtrasComponent, TranslateModule],
  templateUrl: './encabezado-formulario-nuevo.component.html',
  styleUrl: './encabezado-formulario-nuevo.component.scss',
})
export class EncabezadoFormularioNuevoComponent {
  @Input() estadoAprobado: boolean = false;
  @Input() ocultarBtnAtras: boolean = false;
  @Input() btnNuevoCargando: boolean | null = false;
  @Input() btnNuevoDisabled: boolean | null = false;
}
