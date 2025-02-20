import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { General } from '@comun/clases/general';
import { AnimationFadeInLeftDirective } from '@comun/directive/animation-fade-in-left.directive';
import { MenuReducerService } from '@comun/services/menu-reducer.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription, switchMap } from 'rxjs';
import { PageInfoService, PageLink } from '../../../core/page-info.service';
import { obtenerConfiguracionVisualizarBreadCrumbs } from '@redux/selectors/configuracion.selectors';
import { CapitalizePipe } from '@pipe/capitalize.pipe';

interface Breadcrumb {
  label: string | null;
  url?: string;
  active?: boolean;
}

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  imports: [CommonModule, AnimationFadeInLeftDirective, RouterLink, CapitalizePipe],
  standalone: true,
})
export class PageTitleComponent extends General implements OnInit, OnDestroy {
  private _activatedRoute = inject(ActivatedRoute);
  private unsubscribe: Subscription[] = [];
  private readonly _menuReducerService = inject(MenuReducerService);
  private readonly _translateService = inject(TranslateService);
  public visualizarBreadcrumb$: Observable<boolean>

  public breadcrumbSignal = signal<Breadcrumb[]>([]);

  @Input() appPageTitleDirection: string = '';
  @Input() appPageTitleBreadcrumb: boolean;
  @Input() appPageTitleDescription: boolean;

  title$: Observable<string>;
  description$: Observable<string>;
  bc$: Observable<Array<PageLink>>;

  constructor(private pageInfo: PageInfoService) {
    super();
  }

  ngOnInit(): void {
    this.title$ = this.pageInfo.title.asObservable();
    this.description$ = this.pageInfo.description.asObservable();
    this.bc$ = this.pageInfo.breadcrumbs.asObservable();

    this._initializeBreadcrumbs();

    this.visualizarBreadcrumb$ = this.store.select(obtenerConfiguracionVisualizarBreadCrumbs)
  }

  private _initializeBreadcrumbs(): void {
    let breadcrumbs: Breadcrumb[] = [];

    this._activatedRoute.queryParams
      .pipe(
        switchMap((queryParams) =>
          this._menuReducerService.getMenuSeleccionado().pipe(
            switchMap((menuSeleccionado) => {
              breadcrumbs = [];
              const url = this._transformarMenuUrl(menuSeleccionado);
              breadcrumbs.push({
                label: menuSeleccionado,
                url,
              });
              return this._menuReducerService.getModuloItemInformacion(
                menuSeleccionado,
                queryParams.alias
              );
            })
          )
        )
      )
      .subscribe((response) => {
        if (response) {
          const menuTipo = this._transformarMenuTipo(response.tipo);
          let modelo = null;

          if (response?.nombre) {
            modelo = this._translateService.instant(
              `MENU.FUNCIONALIDAD.${response?.nombre.toLocaleUpperCase()}`
            );
          }

          if (menuTipo) {
            breadcrumbs.push({ label: menuTipo });
          }

          if (modelo) {
            breadcrumbs.push({ label: modelo });
          }
        }

        this.breadcrumbSignal.set(breadcrumbs);
      });
  }

  private _transformarMenuUrl(url: string | undefined) {
    switch (url) {
      case 'general':
        return 'dashboard';
      default:
        return url;
    }
  }

  private _transformarMenuTipo(tipo: string | undefined) {
    if (!tipo) {
      return null;
    }

    switch (tipo) {
      case 'independiente':
        return 'movimiento';
      default:
        return tipo;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
