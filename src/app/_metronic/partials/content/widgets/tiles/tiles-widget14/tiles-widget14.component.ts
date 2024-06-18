import { Component, Input } from '@angular/core';
import { KeeniconComponent } from '../../../../../shared/keenicon/keenicon.component';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-tiles-widget14',
    templateUrl: './tiles-widget14.component.html',
    standalone: true,
    imports: [NgClass, KeeniconComponent],
})
export class TilesWidget14Component {
  @Input() cssClass = '';
  constructor() {}
}
