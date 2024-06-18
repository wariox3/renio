import { Component, Input } from '@angular/core';
import { KeeniconComponent } from '../../../../../shared/keenicon/keenicon.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-advance-tables-widget1',
    templateUrl: './advance-tables-widget1.component.html',
    standalone: true,
    imports: [
        NgClass,
        InlineSVGModule,
        KeeniconComponent,
    ],
})
export class AdvanceTablesWidget1Component {
  @Input() cssClass: '';
  constructor() {}
}
