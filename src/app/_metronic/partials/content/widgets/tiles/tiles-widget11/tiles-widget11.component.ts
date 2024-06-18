import { Component, Input, OnInit } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgClass, NgStyle } from '@angular/common';

@Component({
    selector: 'app-tiles-widget11',
    templateUrl: './tiles-widget11.component.html',
    standalone: true,
    imports: [
        NgClass,
        NgStyle,
        InlineSVGModule,
    ],
})
export class TilesWidget11Component implements OnInit {
  @Input() cssClass = '';
  @Input() widgetHeight = '150px';
  @Input() baseColor = 'success';
  textInverseCSSClass = '';

  constructor() {}

  ngOnInit() {
    this.cssClass = `bg-${this.baseColor} ${this.cssClass}`;
    this.textInverseCSSClass = `text-inverse-${this.baseColor}`;
  }
}
