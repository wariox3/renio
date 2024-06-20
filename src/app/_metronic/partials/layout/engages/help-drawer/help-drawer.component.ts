import { Component } from '@angular/core';
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
export class HelpDrawerComponent extends General {
  appDocumentacion: string = environment.appDocumentacion;

  constructor() {
    super()
  }
}
