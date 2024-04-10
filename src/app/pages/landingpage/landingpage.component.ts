import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BtnwhatsappComponent } from '@comun/componentes/btnwhatsapp/btnwhatsapp.component';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule, TranslationService } from '@modulos/i18n';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CountUpModule } from 'ngx-countup';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss'],
  standalone: true,
  imports: [
    BtnwhatsappComponent,
    CommonModule,
    RouterModule,
    TranslateModule,
    TranslationModule,
    NgbDropdownModule,
    CountUpModule
  ],
})
export class LandingpageComponent implements OnInit {
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

  ngOnInit() {
    const fragment = this.activatedRoute.fragment.subscribe((fragment) => {
      if (fragment) {
        document.getElementById(fragment)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      }
    });
    this.setLanguage(this.translationService.getSelectedLanguage());
  }

  abrirMenu() {
    if (window.innerWidth <= 991) {
      this.estadoMenu = true;
    }
  }

  cerrarMenu() {
    this.estadoMenu = false;
  }

  navegacionID(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
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

  @HostListener('window:scroll', ['$event'])
  doSomethingOnWindowsScroll($event: Event) {
    let scrollOffset =
      document.documentElement.scrollTop || document.body.scrollTop;
    this.animateFadeDown = scrollOffset >= 200;
    this.menufijo = scrollOffset >= 200;
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
