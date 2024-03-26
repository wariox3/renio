import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selecionModuloAction } from '@redux/actions/menu.actions';
import {
  obtenerMenuInformacion,
  obtenerMenuSeleccion,
} from '@redux/selectors/menu.selectors';
import { tap, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
})
export class SidebarMenuComponent implements OnInit {
  MenuSeleccion: string | null = null;
  MenuSeleccion$ = this.store.select(obtenerMenuSeleccion);
  arrMenu: any = [];
  arrMenuApps = [ 'COMPRA', 'VENTA', 'CONTABILIDAD', 'CARTERA', 'HUMANO'];

  constructor(private router: Router, private store: Store) {}

  ngOnInit(): void {
    this.cambiarMenu()
  }

  obtenerIcono(nombre: string) {
    switch (nombre) {
      case 'movimiento':
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

  cambiarMenu(){
    this.store
      .select(obtenerMenuSeleccion)
      .pipe(
        withLatestFrom(this.store.select(obtenerMenuInformacion)),
        tap(([nombreSeleccion, menuInformacion]) => {
          console.log(nombreSeleccion);
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
}
