import { Component } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-campaigns',
    templateUrl: './campaigns.component.html',
    standalone: true,
    imports: [
        NgbAccordionModule,
    ],
})
export class CampaignsComponent {
  constructor() {}
}
