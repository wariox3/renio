import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { obtenerUsuarioSuspencion } from '@redux/selectors/usuario.selectors';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';

@Component({
  selector: 'app-comun-alerta-suspension',
  templateUrl: './alerta-suspension.component.html',
  imports: [
    CommonModule,
    TranslateModule,
    TranslationModule,
  ],
  standalone: true
})
export class AlertaSuspensionComponent extends General implements OnInit {

  visualerSuspencion = false

  constructor(){
    super()
  }

  ngOnInit(){
    this.store.select(obtenerUsuarioSuspencion).subscribe((respuesta)=>{
      console.log(respuesta);
      
      this.visualerSuspencion = respuesta
    })
    this.changeDetectorRef.detectChanges()

  }

}
