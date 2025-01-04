import { Component, OnInit } from '@angular/core';
import { LayoutType } from '../../../core/configs/config';
import { LayoutInitService } from '../../../core/layout-init.service';
import { LayoutService } from '../../../core/layout.service';
import { selecionModuloAction } from '@redux/actions/menu.actions';
import { General } from '@comun/clases/general';
import { obtenerConfiguracionVisualizarApp } from '@redux/selectors/configuracion.selectors';
import { switchMap, tap } from 'rxjs';
import {
  obtenerMenuModulos,
  obtenerMenuSeleccion,
} from '@redux/selectors/menu.selectors';
import { obtenerContenedorPlanId } from '@redux/selectors/contenedor.selectors';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { NgIf, NgFor, LowerCasePipe, NgClass, CommonModule } from '@angular/common';
import { AplicacionModulo } from '@comun/type/aplicacion-modulo.type';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    RouterLinkActive,
    RouterLink,
    TranslateModule,
    NgFor,
    CommonModule,
    NgClass,
  ],
})
export class HeaderMenuComponent extends General implements OnInit {
  arrMenuApps: AplicacionModulo[];
  visualizarMenuApps = false;
  ruta = '';

  constructor(
    private layout: LayoutService,
    private layoutInit: LayoutInitService
  ) {
    super();
  }

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(
        switchMap(() => this.store.select(obtenerMenuSeleccion)),
        tap((respuesta: any) => {
          this.ruta = respuesta;
          if(respuesta === 'general'){
            this.ruta = 'Inicio';
          }
          this.changeDetectorRef.detectChanges()
        })
      )
      .subscribe();

    this.store
      .select(obtenerConfiguracionVisualizarApp)
      .pipe(
        tap((respuestaVisualizarApp) => {
          this.visualizarMenuApps = respuestaVisualizarApp;
        }),
        switchMap(() => this.store.select(obtenerContenedorPlanId)),
        switchMap((plan_id) => this.store.select(obtenerMenuModulos(plan_id))),
        tap((respuestaMenuModulos) => {
          this.arrMenuApps = respuestaMenuModulos;
        })
      )
      .subscribe();
  }

  calculateMenuItemCssClass(url: string): string {
    return checkIsActive(this.router.url, url) ? 'active' : '';
  }

  setBaseLayoutType(layoutType: LayoutType) {
    this.layoutInit.setBaseLayoutType(layoutType);
  }

  setToolbar(
    toolbarLayout: 'classic' | 'accounting' | 'extended' | 'reports' | 'saas'
  ) {
    const currentConfig = { ...this.layout.layoutConfigSubject.value };
    if (currentConfig && currentConfig.app && currentConfig.app.toolbar) {
      currentConfig.app.toolbar.layout = 'extended';
      this.layout.saveBaseConfig(currentConfig);
    }
  }

  seleccionarMenu(ruta: AplicacionModulo) {
    this.store.dispatch(selecionModuloAction({ seleccion: ruta }));
  }
}

const getCurrentUrl = (pathname: string): string => {
  return pathname.split(/[?#]/)[0];
};

const checkIsActive = (pathname: string, url: string) => {
  const current = getCurrentUrl(pathname);

  if (!current || !url) {
    return false;
  }

  if (current === url) {
    return true;
  }

  if (current.indexOf(url) > -1) {
    return true;
  }

  return false;
};
