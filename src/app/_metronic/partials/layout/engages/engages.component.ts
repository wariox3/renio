import { Component, OnInit } from '@angular/core';
import { PurchaseToolbarComponent } from './purchase-toolbar/purchase-toolbar.component';
import { TranslateModule } from '@ngx-translate/core';
import { HelpDrawerComponent } from './help-drawer/help-drawer.component';
import { ExploreMainDrawerComponent } from './explore-main-drawer/explore-main-drawer.component';

@Component({
    selector: 'app-engages',
    templateUrl: './engages.component.html',
    styleUrls: ['./engages.component.scss'],
    standalone: true,
    imports: [ExploreMainDrawerComponent, HelpDrawerComponent, TranslateModule, PurchaseToolbarComponent]
})
export class EngagesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
