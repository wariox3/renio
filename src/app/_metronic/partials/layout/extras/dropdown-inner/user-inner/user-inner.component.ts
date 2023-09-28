import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, tap } from 'rxjs';
import { TranslationService } from '../../../../../../modules/i18n';
import { AuthService, UserType } from '../../../../../../modules/auth';
import { Store } from '@ngrx/store';
import { obtenerContenedorId } from '@redux/selectors/contenedor.selectors';
import {
  obtenerUsuarioCargo,
  obtenerUsuarioImagen,
  obtenerUsuarioNombreCorto,
  obtenerUsuarioNombre,
  obtenerUsuarioidioma,
} from '@redux/selectors/usuario.selectors';
import { SubdominioService } from '@comun/services/subdominio.service';
import { Router } from '@angular/router';
import { usuarioActionActualizarIdioma } from '@redux/actions/usuario.actions';
import {
  obtenerEmpresaId,
  obtenerEmpresaNombre,
} from '@redux/selectors/empresa.selectors';
import { environment } from '@env/environment';

@Component({
  selector: 'app-user-inner',
  templateUrl: './user-inner.component.html',
  styleUrls: ['user-inner.scss'],
})
export class UserInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  language: LanguageFlag;
  user$: Observable<UserType>;
  langs = languages;
  usuarioNombreCorto$ = this.store.select(obtenerUsuarioNombreCorto);
  usuarioCargo$ = this.store.select(obtenerUsuarioCargo);
  usuarioImagen$ = this.store.select(obtenerUsuarioImagen);
  usuarioCorreo = this.store.select(obtenerUsuarioNombre);
  obtenerEmpresaNombre$ = this.store.select(obtenerEmpresaNombre);
  private unsubscribe: Subscription[] = [];
  esSubdominio = this.subdominioService.esSubdominioActual();
  visualizarMenuApps = false

  constructor(
    private auth: AuthService,
    private translationService: TranslationService,
    private store: Store,
    private subdominioService: SubdominioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user$ = this.auth.currentUserSubject.asObservable();
    this.setLanguage(this.translationService.getSelectedLanguage());
    this.store
      .select(obtenerUsuarioidioma)
      .pipe(
        tap((idioma) => {
          this.selectLanguage(idioma);
        })
      )
      .subscribe();
      console.log(this.router.url)
      let dominioActual = window.location.host
      if (dominioActual.split('.').length > 2 || environment.production == false) {
        this.visualizarMenuApps = true
      }
  }

  logout() {
    this.auth.logout();
    document.location.reload();
  }

  selectLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.setLanguage(lang);
    this.store.dispatch(
      usuarioActionActualizarIdioma({
        idioma: lang,
      })
    );
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

  navegarAmiContenedor() {
    this.store.select(obtenerContenedorId).subscribe((contenedor_id) => {
      this.router.navigate([
        `/contenedor/detalle/${contenedor_id}/facturacion`,
      ]);
    });
  }

  navegarAmiEmpresa() {
    this.store.select(obtenerEmpresaId).subscribe((empresa_id) => {
      this.router.navigate([`/empresa/detalle/${empresa_id}/`]);
    });
  }

  navegarAmisContenedores() {
    if (this.esSubdominio) {
      location.href = 'http://muup.online/contenedor/lista';
    } else {
      this.router.navigate([`/contenedor/lista`]);
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
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
  // {
  //   lang: 'ja',
  //   name: 'Japanese',
  //   flag: './assets/media/flags/japan.svg',
  // },
  // {
  //   lang: 'de',
  //   name: 'German',
  //   flag: './assets/media/flags/germany.svg',
  // },
  // {
  //   lang: 'fr',
  //   name: 'French',
  //   flag: './assets/media/flags/france.svg',
  // },
  // {
  //   lang: 'zh',
  //   name: 'Mandarin',
  //   flag: './assets/media/flags/china.svg',
  // },
];
