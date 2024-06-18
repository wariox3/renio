import { Component, OnInit } from '@angular/core';
import { KeeniconComponent } from '../../../../../shared/keenicon/keenicon.component';
import { NgClass } from '@angular/common';

type Tabs =
  | 'kt_table_widget_8_tab_1'
  | 'kt_table_widget_8_tab_2'
  | 'kt_table_widget_8_tab_3';

@Component({
    selector: 'app-tables-widget8',
    templateUrl: './tables-widget8.component.html',
    standalone: true,
    imports: [NgClass, KeeniconComponent],
})
export class TablesWidget8Component implements OnInit {
  constructor() {}

  activeTab: Tabs = 'kt_table_widget_8_tab_1';

  setTab(tab: Tabs) {
    this.activeTab = tab;
  }

  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }

  ngOnInit(): void {}
}
