import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
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

  constructor(private router: Router, private store: Store) {}

  ngOnInit(): void {
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

  obtenerIcono(nombre: string) {    
    switch (nombre) {
      case 'movimiento':
        return 'element-7';
      case 'administracion':
        return 'folder';
      case 'informe':
        return 'document';
      case 'proceso':
        return 'notepad';
      case 'utilidad':
        return 'share';
    }
  }
}
