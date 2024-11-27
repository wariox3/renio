import { Component, ContentChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AnimationFadeInUpDirective } from '@comun/directive/animation-fade-in-up.directive';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    AnimationFadeInUpDirective,
],
  templateUrl: './card.component.html',
})
export class CardComponent {
  @Input() titulo?: string = '';
  @Input() visualizarTitulo: boolean = true;

  @ContentChild('panel-footer') footer: any;

  hasFooterContent(): boolean {
    return !!this.footer;
  }
}
