import {Component, OnInit} from '@angular/core';
import {environment} from 'src/environments/environment';
import { KeeniconComponent } from '../../../../shared/keenicon/keenicon.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-help-drawer',
    templateUrl: './help-drawer.component.html',
    standalone: true,
    imports: [TranslateModule, KeeniconComponent],
})
export class HelpDrawerComponent implements OnInit {
  appThemeName: string = environment.appThemeName;
  appPurchaseUrl: string = environment.appPurchaseUrl;

  constructor() {
  }

  ngOnInit(): void {
  }
}
