import { Component, Input } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

@Component({
    selector: 'app-tiles-widget13',
    templateUrl: './tiles-widget13.component.html',
    standalone: true,
    imports: [NgClass, NgStyle],
})
export class TilesWidget13Component {
  @Input() cssClass = '';
  @Input() widgetHeight = '225px';

  constructor() {}
}
