import { Component, OnInit } from '@angular/core';
import { LayoutType } from '../../../core/configs/config';
import { LayoutInitService } from '../../../core/layout-init.service';
import { LayoutService } from '../../../core/layout.service';
import { selecionModuloAction } from '@redux/actions/menu.actions';
import { General } from '@comun/clases/general';
import { environment } from '@env/environment';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent extends General implements OnInit {

  arrMenu = ['CARTERA', 'COMPRA', 'CONTABILIDAD', 'HUMANO', 'VENTA'];

  visualizarMenuApps = false

  constructor(
    private layout: LayoutService,
    private layoutInit: LayoutInitService,
  ) {
    super()
  }

  ngOnInit(): void {
    let dominioActual = window.location.host
    if (dominioActual.split('.').length > 2 || environment.production == false) {
      this.visualizarMenuApps = true
    }
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
      currentConfig.app.toolbar.layout = toolbarLayout;
      this.layout.saveBaseConfig(currentConfig);
    }
  }

  seleccionarMenu(ruta: string){
    localStorage.setItem('ruta', ruta)
    this.store.dispatch(selecionModuloAction({seleccion: ruta}))
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
