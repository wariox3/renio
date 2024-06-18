import { Component, Input, OnInit } from '@angular/core';
import { KeeniconComponent } from '../../../../../../shared/keenicon/keenicon.component';
import { NgClass, NgStyle, NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-cards-widget18',
    templateUrl: './cards-widget18.component.html',
    styleUrls: ['./cards-widget18.component.scss'],
    standalone: true,
    imports: [
        NgClass,
        NgStyle,
        KeeniconComponent,
        NgFor,
        NgIf,
    ],
})
export class CardsWidget18Component implements OnInit {
  @Input() cssClass: string = '';
  @Input() image: string = '';

  cards: Array<{
    name: string;
    src?: string;
    initials?: string;
    state?: string;
  }> = [];

  constructor() {
    this.cards = [
      { name: 'Melody Macy', src: './assets/media/avatars/300-2.jpg' },
      { name: 'Michael Eberon', src: './assets/media/avatars/300-3.jpg' },
      { name: 'Susan Redwood', initials: 'S', state: 'primary' },
    ];
  }

  ngOnInit(): void {}
}
