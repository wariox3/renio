import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BaseLandingpageComponent } from '@comun/componentes/base-landingpage/base-landingpage.component';
import { InputValueCaseDirective } from '@comun/directive/input-value-case.directive';
import { AlertaService } from '@comun/services/alerta.service';
import { LanguageFlag } from '@interfaces/comunes/language-flag/language-flag.interface';
import { TranslationService } from '@modulos/i18n';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CountUpModule } from 'ngx-countup';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss'],
  standalone: true,
  imports: [
    BaseLandingpageComponent,
    CommonModule,
    RouterModule,
    TranslateModule,
    NgbDropdownModule,
    CountUpModule,
    FormsModule,
    ReactiveFormsModule,
    InputValueCaseDirective,
  ],
})
export class LandingpageComponent implements OnInit {
  estadoMenu = false;
  menufijo = false;
  animateFadeDown = false;
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
  formularioContacto: FormGroup;
  fechaActual: Date = new Date();
  selectedPlan: string = 'facturacion';

  constructor(
    private activatedRoute: ActivatedRoute,
    private translationService: TranslationService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private alertaService: AlertaService
  ) {}

  ngOnInit() {
    this.iniciarFormulario();
    this.activatedRoute.fragment.subscribe((fragment) => {
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

  iniciarFormulario() {
    this.formularioContacto = this.formBuilder.group({
      nombre: [null, Validators.compose([Validators.maxLength(200)])],
      correo: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(255),
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        ]),
      ],
      telefono: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      empresa: [null],
      descripcion: [null],
    });
  }

  abrirMenu() {
    if (window.innerWidth <= 991) {
      this.estadoMenu = true;
    }
  }

  cerrarMenu() {
    this.estadoMenu = false;
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

  enviarFormulario() {
    if (this.formularioContacto.valid) {
      this.http
        .post(
          'https://semantica.com.co/api/contacto/nuevo',
          this.formularioContacto.value
        )
        .subscribe(() => {
          this.formularioContacto.reset();
          this.formularioContacto.markAsUntouched();
          this.formularioContacto.markAsDirty();
          this.alertaService.mensajaContactoLandinpage(
            'Hemos enviado su información, uno de nuestros asesores se estará comunicando'
          );
        });
    } else {
      this.formularioContacto.markAllAsTouched();
    }
  }
}
