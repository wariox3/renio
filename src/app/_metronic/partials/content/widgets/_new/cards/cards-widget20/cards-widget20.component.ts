import { Component, Input, OnInit } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

@Component({
    selector: 'app-cards-widget20',
    templateUrl: './cards-widget20.component.html',
    styleUrls: ['./cards-widget20.component.scss'],
    standalone: true,
    imports: [NgClass, NgStyle],
})
export class CardsWidget20Component implements OnInit {
  @Input() cssClass: string = '';
  @Input() description: string = '';
  @Input() color: string = '';
  @Input() img: string = '';
  constructor() {}

  ngOnInit(): void {}
}
