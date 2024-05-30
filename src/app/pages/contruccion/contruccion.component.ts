import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { BtnwhatsappComponent } from "../../comun/componentes/btnwhatsapp/btnwhatsapp.component";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslationModule, TranslationService } from '@modulos/i18n';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-contruccion',
    standalone: true,
    templateUrl: './contruccion.component.html',
    imports: [
        CommonModule,
        BtnwhatsappComponent,
        RouterModule,
        TranslateModule,
        TranslationModule,
    ]
})
export class ContruccionComponent { 
    estadoMenu = false;
    menufijo = false;
    animateFadeDown = false;
    language: LanguageFlag;
    langs = languages;

    constructor(
        private scroller: ViewportScroller,
        private activatedRoute: ActivatedRoute,
        private translationService: TranslationService
      ) {}

    @HostListener('window:scroll', ['$event'])
    doSomethingOnWindowsScroll($event: Event) {
      let scrollOffset =
        document.documentElement.scrollTop || document.body.scrollTop;
      this.animateFadeDown = scrollOffset >= 200;
      this.menufijo = scrollOffset >= 200;
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