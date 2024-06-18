import { Component, OnInit } from '@angular/core';
import { DropdownMenu1Component } from '../../../dropdown-menus/dropdown-menu1/dropdown-menu1.component';
import { KeeniconComponent } from '../../../../../shared/keenicon/keenicon.component';

@Component({
    selector: 'app-tables-widget3',
    templateUrl: './tables-widget3.component.html',
    standalone: true,
    imports: [KeeniconComponent, DropdownMenu1Component],
})
export class TablesWidget3Component implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
