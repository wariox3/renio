import { LowerCasePipe, UpperCasePipe, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { General } from '@comun/clases/general';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-comun-titulo-accion',
  standalone: true,
  imports: [LowerCasePipe, UpperCasePipe, TitleCasePipe, TranslateModule],
  templateUrl: './titulo-accion.component.html',
})
export class TituloAccionComponent extends General {

  constructor(){
    super()
  }
}
