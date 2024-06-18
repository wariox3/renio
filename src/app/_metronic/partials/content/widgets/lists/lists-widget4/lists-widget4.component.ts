import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { DropdownMenu1Component } from '../../../dropdown-menus/dropdown-menu1/dropdown-menu1.component';
import { KeeniconComponent } from '../../../../../shared/keenicon/keenicon.component';

@Component({
    selector: 'app-lists-widget4',
    templateUrl: './lists-widget4.component.html',
    standalone: true,
    imports: [
        KeeniconComponent,
        DropdownMenu1Component,
        NgIf,
    ],
})
export class ListsWidget4Component {
  @Input() items: number = 6;
  constructor() {}
}
