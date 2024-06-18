import { Component, Input } from '@angular/core';
import { DropdownMenu1Component } from '../../../dropdown-menus/dropdown-menu1/dropdown-menu1.component';
import { KeeniconComponent } from '../../../../../shared/keenicon/keenicon.component';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-mixed-widget1',
    templateUrl: './mixed-widget1.component.html',
    standalone: true,
    imports: [
        NgClass,
        KeeniconComponent,
        DropdownMenu1Component,
    ],
})
export class MixedWidget1Component {
  @Input() color: string = '';
  constructor() {}
}
