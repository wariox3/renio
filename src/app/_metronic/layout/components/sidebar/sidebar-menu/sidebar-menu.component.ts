import {
  CommonModule,
  LowerCasePipe,
  NgClass,
  NgFor,
  UpperCasePipe,
} from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { AplicacionModulo } from '@comun/type/aplicacion-modulo.type';
import {
  FuncionalidadConfig,
  ModeloConfig,
} from '@interfaces/menu/configuracion.interface';
import {} from '@modulos/compra/domain/constantes/configuracion.constant';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { configuracionVisualizarAppsAction } from '@redux/actions/configuracion.actions';
import { asignarDocumentacion } from '@redux/actions/documentacion.actions';
import { selecionModuloAction } from '@redux/actions/menu.actions';
import { selectModulosHabilitados } from '@redux/selectors/modulos-manager.selectors';
import { KeeniconComponent } from '../../../../shared/keenicon/keenicon.component';
import { obtenerContenedorNombre } from '@redux/selectors/contenedor.selectors';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
  standalone: true,
  imports: [
    RouterLinkActive,
    KeeniconComponent,
    RouterLink,
    TranslateModule,
    NgFor,
    NgClass,
    CommonModule,
    UpperCasePipe,
    LowerCasePipe,
    NgbTooltipModule,
  ],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: { class: 'd-block' },
})
export class SidebarMenuComponent implements OnInit {
  private readonly _configModule = inject(ConfigModuleService);
  contenedorNombre = this.store.select(obtenerContenedorNombre);

  MenuSeleccion: string | null = null;
  modulo = this._configModule.modulo;
  arrMenu: FuncionalidadConfig[] | undefined = [];
  arrMenuApps: string[];
  moduloAplicacion: AplicacionModulo[] = [
    'compra',
    'venta',
    'contabilidad',
    'cartera',
    'humano',
    'inventario',
    'general',
    'transporte',
    'tesoreria',
  ];

  constructor(
    private router: Router,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this._configModule.currentConfig$.subscribe((config) => {
      this._cargarMenu(config?.funcionalidades);
    });

    this._mostrarModulosNavbar();
    this._cargarMenuModulosSidebarColapsado();
  }

  private _cargarMenu(funcionalidades: FuncionalidadConfig[] | undefined) {
    this.arrMenu = funcionalidades;
  }

  private _cargarMenuModulosSidebarColapsado() {
    this.store.select(selectModulosHabilitados).subscribe((modulos) => {
      this.arrMenuApps = modulos;
    });
  }

  private _mostrarModulosNavbar() {
    this.store.dispatch(
      configuracionVisualizarAppsAction({
        configuracion: {
          visualizarApps: true,
        },
      }),
    );
  }

  obtenerIcono(nombre: string) {
    switch (nombre) {
      case 'documento':
        return 'element-7';
      case 'administracion':
        return 'folder';
      case 'informe':
        return 'document';
      // case 'proceso':
      //   return 'setting-3';
      case 'utilidad':
        return 'share';
      case 'MOVIMIENTO':
        return 'file';
      case 'PERIODO':
        return 'calendar';
      case 'GUIA':
        return 'map';
      case 'nomina':
        return 'dollar';
      case 'seguridadSocial':
        return 'people';
      case 'proceso':
        return 'abstract-26';
      case 'especial':
        return 'abstract-25';
    }
  }

  seleccionarMenu(ruta: string) {
    this.store.dispatch(selecionModuloAction({ seleccion: ruta }));
  }

  navegar(item: ModeloConfig) {
    this.store.dispatch(
      asignarDocumentacion({
        id: item?.documentacion?.id || 0,
        nombre: item.nombreModelo,
      }),
    );

    let queries: {
      modelo?: string;
    } = {};

    if (item.key) {
      queries.modelo = item.key.toString();
    }

    this.router.navigate([`${item.ajustes.rutas.lista}`], {
      queryParams: queries,
    });
  }

  navegarNuevo(item: ModeloConfig) {
    this.store.dispatch(
      asignarDocumentacion({
        id: item?.documentacion?.id || 0,
        nombre: item.nombreModelo,
      }),
    );

    let queries: {
      modelo?: string;
    } = {};

    if (item.key) {
      queries.modelo = item.key.toString();
    }

    this.router.navigate([`${item.ajustes.rutas.nuevo}`], {
      queryParams: queries,
    });
  }
}
