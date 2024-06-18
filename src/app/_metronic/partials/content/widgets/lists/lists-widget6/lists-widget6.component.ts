import { Component } from '@angular/core';
import { DropdownMenu1Component } from '../../../dropdown-menus/dropdown-menu1/dropdown-menu1.component';
import { KeeniconComponent } from '../../../../../shared/keenicon/keenicon.component';

@Component({
    selector: 'app-lists-widget6',
    templateUrl: './lists-widget6.component.html',
    standalone: true,
    imports: [KeeniconComponent, DropdownMenu1Component],
})
export class ListsWidget6Component {
  constructor() {}
}
