import { Component, HostBinding, Input } from '@angular/core';
import { KeeniconComponent } from '../../../../shared/keenicon/keenicon.component';
import { NgIf, NgClass } from '@angular/common';

@Component({
    selector: 'app-card3',
    templateUrl: './card3.component.html',
    standalone: true,
    imports: [
        NgIf,
        NgClass,
        KeeniconComponent,
    ],
})
export class Card3Component {
  @Input() color: string = '';
  @Input() avatar: string = '';
  @Input() online: boolean = false;
  @Input() name: string = '';
  @Input() job: string = '';
  @Input() avgEarnings: string = '';
  @Input() totalEarnings: string = '';
  @HostBinding('class') class = 'card';

  constructor() {}
}
