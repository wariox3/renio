import { Component, OnInit } from '@angular/core';
import { DropdownMenu1Component } from '../../../dropdown-menus/dropdown-menu1/dropdown-menu1.component';
import { KeeniconComponent } from '../../../../../shared/keenicon/keenicon.component';

@Component({
    selector: 'app-feeds-widget2',
    templateUrl: './feeds-widget2.component.html',
    standalone: true,
    imports: [KeeniconComponent, DropdownMenu1Component],
})
export class FeedsWidget2Component implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
