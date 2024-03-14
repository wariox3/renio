import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, TranslateModule, TranslationModule],
  templateUrl: './card.component.html'
})
export class CardComponent {

  @Input() titulo?: string = '';

}
