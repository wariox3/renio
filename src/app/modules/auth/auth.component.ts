import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslationService } from '../i18n';
import { TranslateModule } from '@ngx-translate/core';
import { NgFor, NgClass, NgStyle } from '@angular/common';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem } from '@ng-bootstrap/ng-bootstrap';
import { RouterOutlet, RouterLink } from '@angular/router';
import { BtnwhatsappComponent } from '../../comun/componentes/btnwhatsapp/btnwhatsapp.component';

// const BODY_CLASSES = ['bgi-size-cover', 'bgi-position-center', 'bgi-no-repeat'];

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '<body[root]>',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    standalone: true,
    imports: [
        BtnwhatsappComponent,
        RouterOutlet,
        NgbDropdown,
        NgbDropdownToggle,
        NgbDropdownMenu,
        NgFor,
        NgbDropdownItem,
        NgClass,
        TranslateModule,
        RouterLink,
        NgStyle,
    ],
})
export class AuthComponent implements OnInit, OnDestroy {
  today: Date = new Date();
  language: LanguageFlag;
  langs = languages;

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

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

const languages = [
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
