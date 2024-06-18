import { Component, Input, OnInit } from '@angular/core';
import { KeeniconComponent } from '../../../../../shared/keenicon/keenicon.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-base-tables-widget2',
    templateUrl: './base-tables-widget2.component.html',
    standalone: true,
    imports: [
        NgClass,
        InlineSVGModule,
        KeeniconComponent,
    ],
})
export class BaseTablesWidget2Component implements OnInit {
  TABS: string[] = ['Month', 'Week', 'Day'];
  currentTab: string;
  @Input() cssClass: string;

  constructor() {}

  ngOnInit(): void {
    this.currentTab = this.TABS[2];
  }

  setCurrentTab(tab: string) {
    this.currentTab = tab;
  }
}
