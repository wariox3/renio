import { Component, ContentChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { AnimationFadeinUpDirective } from '@comun/Directive/AnimationFadeinUp.directive';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, TranslateModule, TranslationModule, AnimationFadeinUpDirective],
  templateUrl: './card.component.html'
})
export class CardComponent {

  @Input() titulo?: string = '';

  @ContentChild('panel-footer') footer: any;

  hasFooterContent(): boolean {
    return !!this.footer;
  }
}
