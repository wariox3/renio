import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { KeeniconComponent } from '../../../../shared/keenicon/keenicon.component';
import { TranslateModule } from '@ngx-translate/core';
import { General } from '@comun/clases/general';

@Component({
  selector: 'app-help-drawer',
  templateUrl: './help-drawer.component.html',
  standalone: true,
  imports: [TranslateModule, KeeniconComponent],
})
export class HelpDrawerComponent extends General implements OnInit {
  appDocumentacion: string = environment.appDocumentacion;

  constructor() {
    super()
  }

  ngOnInit() {
    if(this.parametrosUrl.documento_clase == 301){
      this.modelo = 'notacreditocompra'
    }
    if(this.parametrosUrl.documento_clase == 302){
      this.modelo = 'notadebitocompra'
    }
  }
}
