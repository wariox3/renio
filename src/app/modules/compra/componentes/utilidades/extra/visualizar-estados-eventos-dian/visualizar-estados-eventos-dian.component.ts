import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  ReactiveFormsModule
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-visualizar-estados-eventos-dian',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './visualizar-estados-eventos-dian.component.html',
})
export class VisualizarEstadosEventosDianComponent extends General {

  @Input({ required: true }) estado: string;

}
