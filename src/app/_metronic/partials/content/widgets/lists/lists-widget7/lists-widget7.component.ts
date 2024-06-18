import { Component } from '@angular/core';
import { DropdownMenu1Component } from '../../../dropdown-menus/dropdown-menu1/dropdown-menu1.component';
import { KeeniconComponent } from '../../../../../shared/keenicon/keenicon.component';

@Component({
    selector: 'app-lists-widget7',
    templateUrl: './lists-widget7.component.html',
    standalone: true,
    imports: [KeeniconComponent, DropdownMenu1Component],
})
export class ListsWidget7Component {
  constructor() {}
}
