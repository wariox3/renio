import { Component, OnInit } from '@angular/core';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selecionModuloAction } from '@redux/actions/menu.actions';
import { informacionMenuItem } from '@redux/reducers/menu.reducer';
import { obtenerContenedorPlanId } from '@redux/selectors/contenedor.selectors';
import {
  obtenerMenuInformacion,
  obtenerMenuModulos,
  obtenerMenuSeleccion,
} from '@redux/selectors/menu.selectors';
import { switchMap, tap, withLatestFrom } from 'rxjs';
import { NgFor, NgClass, UpperCasePipe, LowerCasePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { KeeniconComponent } from '../../../../shared/keenicon/keenicon.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

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
        UpperCasePipe,
        LowerCasePipe,
    ],
})
export class SidebarMenuComponent implements OnInit {
  MenuSeleccion: string | null = null;
  modulo: string;
  arrMenu: any = [];
  arrMenuApps: string[];

  constructor(
    private router: Router,
    private store: Store,
  ) {}

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

    this.cambiarMenu();
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
    if (item.tipo === 'Administrador') {
      if (item.data) {
        localStorage.setItem('itemNombre', item.data.modelo);
        localStorage.setItem('itemTipo', item.nombre);
      }
    } else {
      localStorage.setItem('itemNombre', item.nombre);
      localStorage.setItem('itemTipo', 'DOCUMENTO');
      localStorage.setItem('consultaHttp', item.consultaHttp? 'si' : 'no');
    }
    localStorage.setItem('itemNombre_tabla', JSON.stringify({}));
    localStorage.setItem('itemNombre_filtros', JSON.stringify({}));
    let url = [item.tipo?.toLocaleLowerCase(), 'lista'];
    if (item.url !== undefined) {
      if (typeof item.url === 'string') {
        // Check if item.url is a string
        url = [item.url]; // If so, assign it as a single element array
      }
    }
    this.router.navigate(url, {
      queryParams: {
        ...item.data,
      },
    });
  }

  navegarNuevo(item: informacionMenuItem) {
    if (item.tipo === 'Administrador') {
      if (item.data) {
        localStorage.setItem('itemNombre', item.data.modelo);
        localStorage.setItem('itemTipo', item.nombre);
      }
    } else {
      localStorage.setItem('itemNombre', item.nombre);
      localStorage.setItem('itemTipo', 'DOCUMENTO');
    }
    localStorage.setItem('itemNombre_tabla', JSON.stringify({}));
    localStorage.setItem('itemNombre_filtros', JSON.stringify({}));
    let url = [item.tipo?.toLocaleLowerCase(), 'nuevo'];
    if (item.url !== undefined) {
      if (typeof item.url === 'string') {
        // Check if item.url is a string
        url = [item.url]; // If so, assign it as a single element array
      }
    }
    this.router.navigate(url, {
      queryParams: {
        ...item.data,
      },
    });
  }
}
