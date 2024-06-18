import { Component, Input, OnInit } from '@angular/core';
import { KeeniconComponent } from '../../../../shared/keenicon/keenicon.component';

@Component({
    selector: 'app-saas',
    templateUrl: './saas.component.html',
    styleUrls: ['./saas.component.scss'],
    standalone: true,
    imports: [KeeniconComponent],
})
export class SaasComponent implements OnInit {
  @Input() appPageTitleDisplay: boolean;

  constructor() {}

  ngOnInit(): void {}
}
