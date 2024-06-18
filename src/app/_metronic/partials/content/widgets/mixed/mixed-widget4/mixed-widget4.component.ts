import { Component, Input } from '@angular/core';
import { DropdownMenu1Component } from '../../../dropdown-menus/dropdown-menu1/dropdown-menu1.component';
import { KeeniconComponent } from '../../../../../shared/keenicon/keenicon.component';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-mixed-widget4',
    templateUrl: './mixed-widget4.component.html',
    standalone: true,
    imports: [
        NgClass,
        KeeniconComponent,
        DropdownMenu1Component,
    ],
})
export class MixedWidget4Component {
  @Input() color: string = '';
  @Input() image: string = '';
  @Input() title: string = '';
  @Input() date: string = '';
  @Input() progress: string = '';
  constructor() {}
}
