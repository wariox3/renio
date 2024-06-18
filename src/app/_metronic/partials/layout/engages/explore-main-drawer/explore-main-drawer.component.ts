import {Component, OnInit} from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-explore-main-drawer',
    templateUrl: './explore-main-drawer.component.html',
    standalone: true,
})
export class ExploreMainDrawerComponent implements OnInit {
  appThemeName: string = environment.appThemeName;
  appPurchaseUrl: string = environment.appPurchaseUrl;
  appPreviewUrl: string = environment.appPreviewUrl;

  constructor() {
  }

  ngOnInit(): void {
  }
}
