import { Component, Input, OnInit } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgClass, NgStyle } from '@angular/common';

@Component({
    selector: 'app-tiles-widget12',
    templateUrl: './tiles-widget12.component.html',
    standalone: true,
    imports: [
        NgClass,
        NgStyle,
        InlineSVGModule,
    ],
})
export class TilesWidget12Component implements OnInit {
  @Input() cssClass = '';
  @Input() widgetHeight = '150px';
  @Input() iconColor = 'success';
  svgCSSClass = '';

  constructor() {}

  ngOnInit() {
    this.svgCSSClass = `svg-icon--${this.iconColor}`;
  }
}
