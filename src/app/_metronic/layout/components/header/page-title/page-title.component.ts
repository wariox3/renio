import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  signal,
  ViewChildren
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { General } from '@comun/clases/general';
import { AnimationFadeInLeftDirective } from '@comun/directive/animation-fade-in-left.directive';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CapitalizePipe } from '@pipe/capitalize.pipe';
import { obtenerConfiguracionVisualizarBreadCrumbs } from '@redux/selectors/configuracion.selectors';
import { ClipboardModule, ClipboardService } from 'ngx-clipboard';
import { Observable, Subscription } from 'rxjs';
import { PageInfoService, PageLink } from '../../../core/page-info.service';
import { BreadcrumbService } from './breadcrumb.service';

interface Breadcrumb {
  label: string | null;
  url?: string;
  active?: boolean;
}

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  imports: [
    CommonModule,
    AnimationFadeInLeftDirective,
    TranslateModule,
    RouterLink,
    CapitalizePipe,
    NgbTooltipModule,
    ClipboardModule,
  ],
  standalone: true,
})
export class PageTitleComponent extends General implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];
  private readonly _clipboardService = inject(ClipboardService);
  private breadcrumbService = inject(BreadcrumbService)
  public visualizarBreadcrumb$: Observable<boolean>;
  public visualizarIconoCopiado = signal(false);
  public breadcrumbSignal = signal<Breadcrumb[]>([]);
  @Input() appPageTitleDirection: string = '';
  @Input() appPageTitleBreadcrumb: boolean;
  @Input() appPageTitleDescription: boolean;
  @ViewChildren('breadcrumbsText') breadcrumbsText!: QueryList<ElementRef>;

  title$: Observable<string>;
  description$: Observable<string>;
  bc$: Observable<Array<PageLink>>;

  
  breadcrumbs = this.breadcrumbService.breadcrumbs$;

  
  constructor(private pageInfo: PageInfoService) {
    super();
  }

  ngOnInit(): void {
    this.title$ = this.pageInfo.title.asObservable();
    this.description$ = this.pageInfo.description.asObservable();
    this.bc$ = this.pageInfo.breadcrumbs.asObservable();

    this.visualizarBreadcrumb$ = this.store.select(
      obtenerConfiguracionVisualizarBreadCrumbs,
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  copiarbreadcrumbsText() {
    this.visualizarIconoCopiado.update(() => true);
    const text = this.breadcrumbsText
      .map((el) => el.nativeElement.innerText)
      .join(' / ');
    this._clipboardService.copy(text);
    setTimeout(() => this.visualizarIconoCopiado.update(() => false), 500);
  }
}
