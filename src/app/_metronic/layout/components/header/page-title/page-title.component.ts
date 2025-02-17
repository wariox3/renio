import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { General } from '@comun/clases/general';
import { MenuReducerService } from '@comun/services/menu-reducer.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription, switchMap } from 'rxjs';
import { PageInfoService, PageLink } from '../../../core/page-info.service';
import { AnimationFadeInLeftDirective } from '@comun/directive/animation-fade-in-left.directive';

interface Breadcrumb {
  label: string | null;
  url?: string;
  active?: boolean;
}

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  imports: [CommonModule, AnimationFadeInLeftDirective, RouterLink],
  standalone: true,
})
export class PageTitleComponent extends General implements OnInit, OnDestroy {
  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private unsubscribe: Subscription[] = [];
  private readonly _menuReducerService = inject(MenuReducerService);
  private readonly _translateService = inject(TranslateService);
  private readonly _destroyRef = inject(DestroyRef);

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
  }

  // private _init() {
  //   this._activatedRoute.queryParams.subscribe((value) => {
  //     this._menuReducerService.getMenuSeleccionado().subscribe((valor) => {
  //       this._menuReducerService
  //         .getModuloItemInformacion(valor, value.alias)
  //         .subscribe((response) => {
  //           let menuTipo = this._transformarMenuTipo(response?.tipo);
  //           let modelo = null;

  //           if (response?.nombre !== undefined) {
  //             modelo = this._translateService.instant(
  //               `MENU.FUNCIONALIDAD.${response?.nombre.toLocaleUpperCase()}`
  //             );
  //           }

  //           this.breadcrumbSignal.set([
  //             {
  //               label: valor,
  //               url: valor,
  //             },
  //           ]);

  //           if (menuTipo) {
  //             this.breadcrumbSignal.update((prevBreadcrumb) => [
  //               ...prevBreadcrumb,
  //               {
  //                 label: menuTipo,
  //               },
  //             ]);
  //           }

  //           if (modelo) {
  //             this.breadcrumbSignal.update((prevBreadcrumb) => [
  //               ...prevBreadcrumb,
  //               {
  //                 label: modelo,
  //               },
  //             ]);
  //           }
  //         });
  //     });
  //   });
  // }

  private _initializeBreadcrumbs(): void {
    let breadcrumbs: Breadcrumb[] = [];

    this._activatedRoute.queryParams
      .pipe(
        switchMap((queryParams) =>
          this._menuReducerService.getMenuSeleccionado().pipe(
            switchMap((menuSeleccionado) => {
              breadcrumbs = [];
              breadcrumbs.push({
                label: menuSeleccionado,
                url: menuSeleccionado,
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
