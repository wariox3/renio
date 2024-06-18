import { Component, Input, OnInit } from '@angular/core';
import { KeeniconComponent } from '../../../../shared/keenicon/keenicon.component';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
    standalone: true,
    imports: [KeeniconComponent],
})
export class ReportsComponent implements OnInit {
  @Input() appPageTitleDisplay: boolean;

  constructor() {}

  ngOnInit(): void {}
}
