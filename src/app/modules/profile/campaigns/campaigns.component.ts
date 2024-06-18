import { Component } from '@angular/core';
import { NgbAccordion, NgbPanel, NgbPanelHeader, NgbPanelToggle, NgbPanelContent } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-campaigns',
    templateUrl: './campaigns.component.html',
    standalone: true,
    imports: [
        NgbAccordion,
        NgbPanel,
        NgbPanelHeader,
        NgbPanelToggle,
        NgbPanelContent,
    ],
})
export class CampaignsComponent {
  constructor() {}
}
