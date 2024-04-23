import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selecionModuloAction } from '@redux/actions/menu.actions';
import { informacionMenuItem } from '@redux/reducers/menu.reducer';
import {
  obtenerMenuInformacion,
  obtenerMenuModulos,
  obtenerMenuSeleccion,
} from '@redux/selectors/menu.selectors';
import { combineLatest, forkJoin, tap, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
})
export class SidebarMenuComponent implements OnInit {
  MenuSeleccion: string | null = null;
  modulo: string;
  arrMenu: any = [];
  arrMenuApps: string[];

  constructor(private router: Router, private store: Store) {}

  ngOnInit(): void {
    combineLatest([
      this.store.select(obtenerMenuSeleccion),
      this.store.select(obtenerMenuModulos),
    ]).subscribe((respuesta) => {
      this.modulo = respuesta[0];
      this.arrMenuApps = respuesta[1];
    });
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
    }
    localStorage.setItem('itemNombre_tabla', JSON.stringify({}));
    localStorage.setItem('itemNombre_filtros', JSON.stringify({}));
    this.router.navigate([item.tipo?.toLocaleLowerCase(), 'lista'], {
      queryParams: {
        ...item.data,
      },
    });
  }
}
