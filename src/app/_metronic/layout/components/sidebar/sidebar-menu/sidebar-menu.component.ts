import {
  CommonModule,
  LowerCasePipe,
  NgClass,
  NgFor,
  UpperCasePipe,
} from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { AplicacionModulo } from '@comun/type/aplicacion-modulo.type';
import { } from '@modulos/compra/domain/constantes/configuracion.constant';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { configuracionVisualizarAppsAction } from '@redux/actions/configuracion.actions';
import { asignarDocumentacion } from '@redux/actions/documentacion.actions';
import {
  selecionModuloAction
} from '@redux/actions/menu.actions';
import { obtenerContenedorPlanId } from '@redux/selectors/contenedor.selectors';
import {
  obtenerMenuInformacion,
  obtenerMenuModulos,
  obtenerMenuSeleccion,
} from '@redux/selectors/menu.selectors';
import { switchMap, tap, withLatestFrom } from 'rxjs';
import { KeeniconComponent } from '../../../../shared/keenicon/keenicon.component';
import { FuncionalidadConfig, ModeloConfig } from '@interfaces/menu/configuracion.interface';

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

  private activatedRoute = inject(ActivatedRoute);

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

    // this.router.events
    //   .pipe(
    //     filter(
    //       (event): event is NavigationEnd => event instanceof NavigationEnd,
    //     ), // Asegura que el evento es NavigationEnd
    //   )
    //   .subscribe((evento: NavigationEnd) => {
    //     const url = evento.urlAfterRedirects; // Obtener la URL actual
    //     const moduloKey = url.replace('/', ''); // Eliminar el "/"
    //     // Verificar si el módulo existe en el array `moduloAplicacion`
    //     if (this.moduloAplicacion.includes(moduloKey as AplicacionModulo)) {
    //       // Despachar la acción con el módulo encontrado
    //       this.store.dispatch(
    //         selecionModuloAction({ seleccion: moduloKey as AplicacionModulo }),
    //       );
    //     } else if (moduloKey === 'dashboard') {
    //       this.store.dispatch(selecionModuloAction({ seleccion: 'general' }));
    //     }
    //   });

    // this.cambiarMenu();
    // this._cargarModulo();
    // this.cambiarMenu();
  }

  private _cargarMenu(funcionalidades: FuncionalidadConfig[] | undefined) {
    this.arrMenu = funcionalidades;
  }

  private _cargarMenuModulosSidebarColapsado() {
    this.store
      .select(obtenerContenedorPlanId)
      .pipe(
        switchMap((plan_id) => this.store.select(obtenerMenuModulos(plan_id))),
        tap((respuestaMenuModulos) => {
          this.arrMenuApps = respuestaMenuModulos;
        }),
      )
      .subscribe();
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

  private _cargarModulo() {
    // this.activatedRoute.queryParams.subscribe((params) => {
    //   if (params.modulo !== undefined) {
    //     this.store.dispatch(selecionModuloAction({ seleccion: params.modulo }));
    //   }
    //   this.arrMenu.forEach((item: any) => {
    //     this._cargarDatosMenu(item, params);
    //   });
    // });
  }

  // private _cargarDatosMenu(item: any, parametros: any) {
  //   // buscamos la coincidencia entre el modelo en la URL y el modelo de los childrens del item
  //   const childrenFound = item?.children?.find((info: any) => {
  //     return info.nombre === parametros?.alias;
  //   });

  //   if (!childrenFound) return;

  //   // cargamos los datos al reducer
  //   this._cargarReducerData(childrenFound);
  // }

  // TODO: No lo entiendo
  // private _cargarReducerData(item: informacionMenuItem) {
  //   if (item?.archivoImportacionLista !== undefined) {
  //     this.store.dispatch(
  //       asignarArchivoImportacionLista({
  //         lista: item?.archivoImportacionLista,
  //       }),
  //     );
  //   } else {
  //     this.store.dispatch(
  //       asignarArchivoImportacionLista({
  //         lista: null,
  //       }),
  //     );
  //   }

  //   this.store.dispatch(ActualizarDataItem({ dataItem: item }));

  //   this.store.dispatch(
  //     asignarDocumentacion({
  //       id: item?.documentacionId || 0,
  //       nombre: item.nombre,
  //     }),
  //   );
  // }

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
        return 'abstract-26'
      case 'especial':
        return 'abstract-25'
    }
  }

  seleccionarMenu(ruta: string) {
    this.store.dispatch(selecionModuloAction({ seleccion: ruta }));
  }

  cambiarMenu() {
    this.store
      .select(obtenerMenuSeleccion)
      .pipe(
        withLatestFrom(this.store.select(obtenerMenuInformacion)),
        tap(([nombreSeleccion, menuInformacion]) => {
          this.MenuSeleccion = nombreSeleccion;
          let componenteMenu = menuInformacion.filter(
            (item) => item.nombre == nombreSeleccion.toLowerCase(),
          );
          if (componenteMenu[0]?.children) {
            // this.arrMenu = componenteMenu[0].children;
          }
        }),
      )
      .subscribe();
  }

  navegar(item: ModeloConfig) {
    // TODO: No lo entiendo
    // this.store.dispatch(ActualizarDataItem({ dataItem: item }));
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

    // TODO: No lo entiendo
    // if (item?.data?.filtrosLista) {
    //   this.construirFiltros(item);
    // }

    // TODO: No lo entiendo
    // let parametros = this.construirParametros(item);
    // localStorage.setItem('itemNombre_tabla', JSON.stringify({}));
    // localStorage.setItem('itemNombre_filtros', JSON.stringify({}));
    // let url = [item.tipo?.toLocaleLowerCase(), 'lista'];
    // if (item.url !== undefined || item.urlIndependientes !== undefined) {
    //   if (typeof item.url === 'string') {
    //     // Check if item.url is a string
    //     url = [item.url]; // If so, assign it as a single element array
    //   } else {
    //     url = [item.urlIndependientes?.lista];
    //   }
    // }

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

    // TODO: No lo entiendo
    // let parametros = this.construirParametros(item);
    // localStorage.setItem('itemNombre_tabla', JSON.stringify({}));
    // localStorage.setItem('itemNombre_filtros', JSON.stringify({}));
    // let url = [item.tipo?.toLocaleLowerCase(), 'nuevo'];
    // if (item.url !== undefined) {
    //   if (typeof item.url === 'string') {
    //     url = [item.url];
    //   }
    // }

    this.router.navigate([`${item.ajustes.rutas.nuevo}`], {
      queryParams: queries,
    });
  }

  // construirParametros(item: informacionMenuItem) {
  //   switch (item.tipo) {
  //     case 'administrador':
  //       if (item.data?.submodelo) {
  //         return {
  //           alias: item.nombre,
  //           modulo: item.modulo,
  //           itemNombre: item.data?.modelo,
  //           submodelo: item.data?.submodelo,
  //           itemTipo: item.nombre,
  //           consultaHttp: item.consultaHttp ? 'si' : 'no',
  //           esIndependiente: 'no',
  //         };
  //       }
  //       return {
  //         alias: item.nombre,
  //         modulo: item.modulo,
  //         itemNombre: item.data?.modelo,
  //         itemTipo: item.nombre,
  //         consultaHttp: item.consultaHttp ? 'si' : 'no',
  //         esIndependiente: 'no',
  //       };
  //     case 'documento':
  //       return {
  //         alias: item.nombre,
  //         modulo: item.modulo,
  //         itemNombre: item.nombre,
  //         itemTipo: 'DOCUMENTO',
  //         consultaHttp: item.consultaHttp ? 'si' : 'no',
  //         esIndependiente: 'no',
  //         configuracionExtra: item.configuracionExtra ? 'si' : 'no',
  //       };
  //     case 'independiente':
  //       return {
  //         alias: item.nombre,
  //         modulo: item.modulo,
  //         itemNombre: item.nombre,
  //         itemTipo: 'DOCUMENTO',
  //         consultaHttp: item.consultaHttp ? 'si' : 'no',
  //         esIndependiente: 'no',
  //       };
  //     case 'utilidad':
  //       return {
  //         alias: item.nombre,
  //         modulo: item.modulo,
  //         itemNombre: item.nombre,
  //         itemTipo: 'DOCUMENTO',
  //       };
  //     case 'informe':
  //       return {
  //         alias: item.nombre,
  //         modulo: item.modulo,
  //         itemNombre: item.nombre,
  //         itemTipo: 'DOCUMENTO',
  //       };
  //   }
  // }

  // construirFiltros(item: informacionMenuItem) {
  //   if (item.tipo !== undefined) {
  //     let nombreFiltroLista = `${item.tipo.toLowerCase()}_${item.nombre.toLowerCase()}_filtro_lista_fijo`;
  //     let nombreImportarLista = `${item.tipo.toLowerCase()}_${item.nombre.toLowerCase()}_filtro_importar_fijo`;
  //     localStorage.setItem(
  //       nombreFiltroLista,
  //       JSON.stringify(item?.data?.filtrosLista),
  //     );
  //     localStorage.setItem(
  //       nombreImportarLista,
  //       JSON.stringify(item?.data?.filtrosImportar),
  //     );
  //   }
  // }
}
