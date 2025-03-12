import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { BtnWhatsappComponent } from '@comun/componentes/btn-whatsapp/btn-whatsapp.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '@modulos/i18n';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactarAsesorComponent } from "../contactar-asesor/contactar-asesor.component";

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

@Component({
  selector: 'app-base-landingpage',
  standalone: true,
  imports: [
    CommonModule,
    BtnWhatsappComponent,
    RouterModule,
    TranslateModule,
    NgbDropdownModule,
    NgOptimizedImage,
    ContactarAsesorComponent
],
  templateUrl: './base-landingpage.component.html',
  styleUrls: ['./base-landingpage.component.scss'],
})
export class BaseLandingpageComponent implements OnInit {
  private readonly _modalService = inject(NgbModal)
  fechaActual: Date = new Date();
  estadoMenu = false;
  menufijo = false;
  animateFadeDown = false;
  language: LanguageFlag;
  languages = [
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private translationService: TranslationService,
  ) {}


  ngOnInit() {
    this.activatedRoute.fragment.subscribe((fragment) => {
      if (fragment) {
        this.navegacionID(fragment)
      }
    });
    this.setLanguage(this.translationService.getSelectedLanguage());
  }

  selectLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.setLanguage(lang);
    // document.location.reload();
  }

  setLanguage(lang: string) {
    this.languages.forEach((language: LanguageFlag) => {
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

  abrirMenu() {
    if (window.innerWidth <= 991) {
      this.estadoMenu = true;
    }
  }

  cerrarMenu() {
    this.estadoMenu = false;
  }

  navegacionID(id: string) {
    // Desplazamiento vertical adicional que se aplicará al resultado del cálculo de la posición
    const yOffset = -240;
    // Busca un elemento en el documento HTML con el ID especificado por la variable `id` y lo almacena en la variable `element`
    const element = document.getElementById(id);
    // Calcula la posición vertical (en píxeles) del borde superior del elemento respecto a la parte superior del área de contenido del viewport (la ventana del navegador), y le suma el desplazamiento actual de la página y el desplazamiento adicional
    const y =
      element!.getBoundingClientRect().top + window.pageYOffset + yOffset;
    // Utiliza la función `scrollTo` del objeto `window` para desplazar la ventana del navegador hacia una posición específica
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  abrirModalContactarAsesor(content: any) {
    this._modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'lg',
    });
  }
}
