import { Component, ContentChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AnimationFadeinUpDirective } from '@comun/Directive/AnimationFadeinUp.directive';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    AnimationFadeinUpDirective,
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
