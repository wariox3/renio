import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-stats-widget6',
    templateUrl: './stats-widget6.component.html',
    standalone: true,
    imports: [NgClass],
})
export class StatsWidget6Component {
  @Input() progress = '';
  @Input() color = '';
  @Input() description = '';
  @Input() title = '';

  constructor() {}
}
