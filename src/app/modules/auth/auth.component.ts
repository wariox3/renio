import { NgClass, NgFor, NgStyle } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BtnWhatsappComponent } from '@comun/componentes/btn-whatsapp/btn-whatsapp.component';
import { LanguageFlag } from '@interfaces/comunes/language-flag/language-flag.interface';
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../i18n';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '<body[root]>',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  imports: [
    BtnWhatsappComponent,
    RouterOutlet,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgFor,
    NgbDropdownItem,
    NgClass,
    TranslateModule,
    RouterLink,
  ],
})
export class AuthComponent implements OnInit, OnDestroy {
  today: Date = new Date();
  language: LanguageFlag;
  langs = [
    {
      lang: 'es',
      name: 'Español',
      flag: './assets/media/flags/spain.svg',
    },
    {
      lang: 'en',
      name: 'English',
      flag: './assets/media/flags/united-states.svg',
    },
  ];

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    this.setLanguage(this.translationService.getSelectedLanguage());
  }

  selectLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.setLanguage(lang);
    // document.location.reload();
  }

  setLanguage(lang: string) {
    this.langs.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
  }

  ngOnDestroy() {
    // BODY_CLASSES.forEach((c) => document.body.classList.remove(c));
  }
}
