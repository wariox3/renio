import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { General } from '@comun/clases/general';
import { SubdominioService } from '@comun/services/subdominio.service';
import { TranslateModule } from '@ngx-translate/core';
import { configuracionVisualizarBreadCrumbsAction } from '@redux/actions/configuracion.actions';
import { ContenedorActionBorrarInformacion } from '@redux/actions/contenedor.actions';
import { ModulosManagerLimpiar } from '@redux/actions/modulos-manager.action';
import { usuarioActionActualizarIdioma } from '@redux/actions/usuario.actions';
import { obtenerConfiguracionVisualizarApp } from '@redux/selectors/configuracion.selectors';
import { obtenerContenedorId } from '@redux/selectors/contenedor.selectors';
import {
  obtenerEmpresaId,
  obtenerEmpresaNombre,
} from '@redux/selectors/empresa.selectors';
import {
  obtenerUsuarioImagen,
  obtenerUsuarioNombreCorto,
  obtenerUsuarioSocio,
  obtenerUsuarioUserName,
  obtenerUsuarioidioma,
} from '@redux/selectors/usuario.selectors';
import {
  Observable,
  Subject,
  Subscription,
  combineLatest,
  takeUntil
} from 'rxjs';
import { AuthService, UserType } from '../../../../../../modules/auth';
import { TranslationService } from '../../../../../../modules/i18n';

@Component({
  selector: 'app-user-inner',
  templateUrl: './user-inner.component.html',
  styleUrls: ['user-inner.scss'],
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, NgClass, AsyncPipe, TranslateModule],
})
export class UserInnerComponent extends General implements OnInit, OnDestroy {
  @HostBinding('class')
  class =
    `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  language: LanguageFlag;
  user$: Observable<UserType>;
  // esSocio$: Observable<boolean>;
  langs = languages;
  usuarioNombreCorto$ = this.store.select(obtenerUsuarioNombreCorto);
  usuarioImagen$ = this.store.select(obtenerUsuarioImagen);
  usuarioCorreo = this.store.select(obtenerUsuarioUserName);
  obtenerEmpresaNombre$ = this.store.select(obtenerEmpresaNombre);
  obtenerEsSocio$ = this.store.select(obtenerUsuarioSocio);
  private unsubscribe: Subscription[] = [];
  visualizarMenuApps = false;
  private destroy$ = new Subject<void>();
  public contenedorId: string;
  public empresaId: string;

  constructor(
    private auth: AuthService,
    private translationService: TranslationService,
    private subdominioService: SubdominioService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.user$ = this.auth.currentUserSubject.asObservable();
    this.setLanguage(this.translationService.getSelectedLanguage());
    combineLatest(
      this.store.select(obtenerUsuarioidioma),
      this.store.select(obtenerConfiguracionVisualizarApp),
    ).subscribe(([idioma, VisualizarApp]) => {
      this.selectLanguage(idioma);
      this.visualizarMenuApps = VisualizarApp;
      this.changeDetectorRef.detectChanges();
    });
    this.changeDetectorRef.detectChanges();

    this._initStoreSuscripciones();
  }

  private _initStoreSuscripciones() {
    this.store
      .select(obtenerContenedorId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((contenedor_id) => {
        this.contenedorId = contenedor_id;
      });

    this.store
      .select(obtenerEmpresaId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((empresa_id) => {
        this.empresaId = empresa_id;
      });
  }

  logout() {
    this.auth.logout();
  }

  selectLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.setLanguage(lang);
    this.store.dispatch(
      usuarioActionActualizarIdioma({
        idioma: lang,
      }),
    );
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
    this.router.navigate([`/contenedor/detalle/${this.contenedorId}/`]);
  }

  navegarAmiEmpresa() {
    this.router.navigate([`/empresa/detalle/${this.empresaId}/`]);
  }

  navegarAmiEmpresaConfiguracion() {
    this.store.dispatch(
      configuracionVisualizarBreadCrumbsAction({
        configuracion: {
          visualizarBreadCrumbs: false,
        },
      }),
    );

    this.router.navigate([`/empresa/configuracion_modulos/${this.empresaId}/`]);
  }

  navegarAmisContenedores() {
    this.store.dispatch(ContenedorActionBorrarInformacion());
    this.store.dispatch(ModulosManagerLimpiar());

    this.router.navigate([`/contenedor/lista`]);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this.destroy$.next();
    this.destroy$.unsubscribe();
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
