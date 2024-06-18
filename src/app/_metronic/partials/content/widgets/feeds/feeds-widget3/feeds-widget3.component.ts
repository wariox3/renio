import { Component, OnInit } from '@angular/core';
import { DropdownMenu2Component } from '../../../dropdown-menus/dropdown-menu2/dropdown-menu2.component';
import { KeeniconComponent } from '../../../../../shared/keenicon/keenicon.component';

@Component({
    selector: 'app-feeds-widget3',
    templateUrl: './feeds-widget3.component.html',
    standalone: true,
    imports: [KeeniconComponent, DropdownMenu2Component],
})
export class FeedsWidget3Component implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
