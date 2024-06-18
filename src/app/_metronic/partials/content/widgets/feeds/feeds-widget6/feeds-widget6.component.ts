import { Component, OnInit } from '@angular/core';
import { DropdownMenu1Component } from '../../../dropdown-menus/dropdown-menu1/dropdown-menu1.component';
import { KeeniconComponent } from '../../../../../shared/keenicon/keenicon.component';

@Component({
    selector: 'app-feeds-widget6',
    templateUrl: './feeds-widget6.component.html',
    standalone: true,
    imports: [KeeniconComponent, DropdownMenu1Component],
})
export class FeedsWidget6Component implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
