import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
    selector: 'app-stats-widget5',
    templateUrl: './stats-widget5.component.html',
    standalone: true,
    imports: [InlineSVGModule, NgClass],
})
export class StatsWidget5Component {
  @Input() svgIcon = '';
  @Input() iconColor = '';
  @Input() color = '';
  @Input() description = '';
  @Input() title = '';

  constructor() {}
}
