import { Component, Input } from '@angular/core';
import { NgIf, NgClass, NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        NgClass,
        NgTemplateOutlet,
    ],
})
export class FooterComponent {
  @Input() appFooterContainerCSSClass: string = '';

  currentDateStr: string = new Date().getFullYear().toString();
  constructor() {}
}
