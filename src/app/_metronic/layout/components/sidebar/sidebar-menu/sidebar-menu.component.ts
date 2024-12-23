import { Component, inject, OnInit } from '@angular/core';
import {
  Router,
  RouterLinkActive,
  RouterLink,
  ActivatedRoute,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { selecionModuloAction } from '@redux/actions/menu.actions';
import { obtenerContenedorPlanId } from '@redux/selectors/contenedor.selectors';
import {
  obtenerMenuInformacion,
  obtenerMenuModulos,
  obtenerMenuSeleccion,
} from '@redux/selectors/menu.selectors';
import { switchMap, tap, withLatestFrom } from 'rxjs';
import {
  NgFor,
  NgClass,
  UpperCasePipe,
  LowerCasePipe,
  CommonModule,
} from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { KeeniconComponent } from '../../../../shared/keenicon/keenicon.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { informacionMenuItem } from '@interfaces/menu/menu';
import { asignarDocumentacionId } from '@redux/actions/documentacion.actions';
import { asignarArchivoImportacionLista } from '@redux/actions/archivo-importacion.actions';

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
  MenuSeleccion: string | null = null;
  modulo: string;
  arrMenu: any = [];
  arrMenuApps: string[];

  private _route = inject(ActivatedRoute);

  constructor(private router: Router, private store: Store) {}

  ngOnInit(): void {
    this.store
      .select(obtenerMenuSeleccion)
      .pipe(
        tap((respuestaMenuSeleccion) => {
          this.modulo = respuestaMenuSeleccion;
        }),
        switchMap(() => this.store.select(obtenerContenedorPlanId)),
        switchMap((plan_id) => this.store.select(obtenerMenuModulos(plan_id))),
        tap((respuestaMenuModulos) => {
          this.arrMenuApps = respuestaMenuModulos;
        })
      )
      .subscribe();
    this.cambiarMenu();
    this._cargarModulo();
    this.cambiarMenu();
  }

  private _cargarModulo() {
    this._route.queryParams.subscribe((params) => {
      this.arrMenu.forEach((item: any) => {
        // buscamos la seccion de administracion en el menu
        switch (item.nombre) {
          case 'administracion':
            this._cargarDatosMenu(item, params);
            break;
          case 'independientes':
            this._cargarDatosMenu(item, params);
            break;
        }
      });
    });
  }

  private _cargarDatosMenu(item: any, parametros: any) {
    // buscamos la coincidencia entre el modelo en la URL y el modelo de los childrens del item
    const childrenFound = item?.children?.find((info: any) => {
      return info.data?.modelo === parametros?.modelo;
    });

    // cargamos los datos al reducer
    this._cargarReducerData(childrenFound);
  }

  private _cargarReducerData(item: informacionMenuItem | undefined) {
    if (item?.archivoImportacionLista !== undefined) {
      this.store.dispatch(
        asignarArchivoImportacionLista({
          lista: item?.archivoImportacionLista,
        })
      );
    }

    this.store.dispatch(
      asignarDocumentacionId({ id: item?.documentacionId || 0 })
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
      case 'proceso':
        return 'setting-3';
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
            (item) => item.nombre == nombreSeleccion.toLowerCase()
          );
          if (componenteMenu[0]?.children) {
            this.arrMenu = componenteMenu[0].children;
          }
        })
      )
      .subscribe();
  }

  navegar(item: informacionMenuItem) {
    this.store.dispatch(
      asignarDocumentacionId({ id: item?.documentacionId || 0 })
    );

    if (item?.data?.filtrosLista) {
      this.construirFiltros(item);
    }

    let parametros = this.construirParametros(item);
    localStorage.setItem('itemNombre_tabla', JSON.stringify({}));
    localStorage.setItem('itemNombre_filtros', JSON.stringify({}));
    let url = [item.tipo?.toLocaleLowerCase(), 'lista'];
    if (item.url !== undefined || item.urlIndependientes !== undefined) {
      if (typeof item.url === 'string') {
        // Check if item.url is a string
        url = [item.url]; // If so, assign it as a single element array
      } else {
        url = [item.urlIndependientes?.lista];
      }
    }
    this.router.navigate(url, {
      queryParams: {
        ...item.data,
        ...parametros,
      },
    });
  }

  navegarNuevo(item: informacionMenuItem) {
    this.store.dispatch(
      asignarDocumentacionId({ id: item?.documentacionId || 0 })
    );
    let parametros = this.construirParametros(item);
    localStorage.setItem('itemNombre_tabla', JSON.stringify({}));
    localStorage.setItem('itemNombre_filtros', JSON.stringify({}));
    let url = [item.tipo?.toLocaleLowerCase(), 'nuevo'];
    if (item.url !== undefined) {
      if (typeof item.url === 'string') {
        url = [item.url];
      }
    }
    this.router.navigate(url, {
      queryParams: {
        ...item.data,
        ...parametros,
      },
    });
  }

  construirParametros(item: informacionMenuItem) {
    switch (item.tipo) {
      case 'Administrador':
        if (item.data?.submodelo) {
          return {
            itemNombre: item.data?.modelo,
            submodelo: item.data?.submodelo,
            itemTipo: item.nombre,
            consultaHttp: item.consultaHttp ? 'si' : 'no',
            esIndependiente: 'no',
          };
        }
        return {
          itemNombre: item.data?.modelo,
          itemTipo: item.nombre,
          consultaHttp: item.consultaHttp ? 'si' : 'no',
          esIndependiente: 'no',
        };
      case 'Documento':
        return {
          itemNombre: item.nombre,
          itemTipo: 'DOCUMENTO',
          consultaHttp: item.consultaHttp ? 'si' : 'no',
          esIndependiente: 'no',
          configuracionExtra: item.configuracionExtra ? 'si' : 'no',
        };
      case 'Independiente':
        return {
          itemNombre: item.nombre,
          itemTipo: 'DOCUMENTO',
          consultaHttp: item.consultaHttp ? 'si' : 'no',
          esIndependiente: 'no',
        };
      case 'utilidad':
        return {
          itemNombre: item.nombre,
          itemTipo: 'DOCUMENTO',
        };
      case 'informe':
        return {
          itemNombre: item.nombre,
          itemTipo: 'DOCUMENTO',
        };
    }
  }

  construirFiltros(item: informacionMenuItem) {
    if (item.tipo !== undefined) {
      let nombreFiltroLista = `${item.tipo.toLowerCase()}_${item.nombre.toLowerCase()}_filtro_lista_fijo`;
      let nombreImportarLista = `${item.tipo.toLowerCase()}_${item.nombre.toLowerCase()}_filtro_importar_fijo`;
      localStorage.setItem(
        nombreFiltroLista,
        JSON.stringify(item?.data?.filtrosLista)
      );
      localStorage.setItem(
        nombreImportarLista,
        JSON.stringify(item?.data?.filtrosImportar)
      );
    }
  }
}
