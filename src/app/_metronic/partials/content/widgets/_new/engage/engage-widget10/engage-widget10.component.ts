import { Component, Input, OnInit } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

@Component({
    selector: 'app-engage-widget10',
    templateUrl: './engage-widget10.component.html',
    styleUrls: ['./engage-widget10.component.scss'],
    standalone: true,
    imports: [NgClass, NgStyle]
})
export class EngageWidget10Component implements OnInit {
  @Input() cssClass: string = ''
  constructor() { }

  ngOnInit(): void {
  }

}
