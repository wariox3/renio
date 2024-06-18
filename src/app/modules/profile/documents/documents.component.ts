import { Component } from '@angular/core';
import { Card4Component } from '../../../_metronic/partials/content/cards/card4/card4.component';
import { KeeniconComponent } from '../../../_metronic/shared/keenicon/keenicon.component';

@Component({
    selector: 'app-documents',
    templateUrl: './documents.component.html',
    standalone: true,
    imports: [KeeniconComponent, Card4Component],
})
export class DocumentsComponent {
  constructor() {}
}
