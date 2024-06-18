import { Component, OnInit } from '@angular/core';
import { KeeniconComponent } from '../../../../../shared/keenicon/keenicon.component';

@Component({
    selector: 'app-advance-tables-widget2',
    templateUrl: './advance-tables-widget2.component.html',
    standalone: true,
    imports: [KeeniconComponent],
})
export class AdvanceTablesWidget2Component implements OnInit {
  currentTab = 'Day';

  constructor() {}

  ngOnInit(): void {}

  setCurrentTab(tab: string) {
    this.currentTab = tab;
  }
}
