import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';
import { TranslationService } from './modules/i18n';
// language list
import { RouterOutlet } from '@angular/router';
import { locale as chLang } from './modules/i18n/vocabs/ch';
import { locale as deLang } from './modules/i18n/vocabs/de';
import { locale as enLang } from './modules/i18n/vocabs/en';
import { locale as esLang } from './modules/i18n/vocabs/es';
import { locale as frLang } from './modules/i18n/vocabs/fr';
import { locale as jpLang } from './modules/i18n/vocabs/jp';

@Component({
    // tslint:disable-next-line:component-selector
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'body[root]',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [RouterOutlet],
})
export class AppComponent  {

  constructor(
    private translationService: TranslationService,
  ) {
    // register translations
    this.translationService.loadTranslations(
      enLang,
      chLang,
      esLang,
      jpLang,
      deLang,
      frLang
    );
  }


}
