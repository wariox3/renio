import { Component, OnInit } from '@angular/core';
import { KeeniconComponent } from '../../../../../../shared/keenicon/keenicon.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-lists-widget26',
    templateUrl: './lists-widget26.component.html',
    styleUrls: ['./lists-widget26.component.scss'],
    standalone: true,
    imports: [
        NgFor,
        KeeniconComponent,
        NgIf,
    ],
})
export class ListsWidget26Component implements OnInit {
  rows: Array<{ description: string }>;

  constructor() {}

  ngOnInit(): void {
    this.rows = [
      { description: 'Avg. Client Rating' },
      { description: 'Instagram Followers' },
      { description: 'Google Ads CPC' },
    ];
  }
}
