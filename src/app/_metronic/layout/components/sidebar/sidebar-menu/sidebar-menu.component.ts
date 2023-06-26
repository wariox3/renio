import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { obtenerMenuInformacion } from '@redux/selectors/menu-informacion.selectors';
import { obtenerMenuSeleccion } from '@redux/selectors/menu-seleccion.selectors';
import { tap, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
})
export class SidebarMenuComponent implements OnInit {
  MenuSeleccion: string | null = null;
  MenuSeleccion$ = this.store.select(obtenerMenuSeleccion);
  arrMenu:any = []

  constructor(private router: Router, private store: Store) {}

  ngOnInit(): void {
    this.store
      .select(obtenerMenuSeleccion)
      .pipe(
        withLatestFrom(this.store.select(obtenerMenuInformacion)),
        tap(([nombreSeleccion, menuInformacion]) => {
          console.log({
            nombreSeleccion,
            menuInformacion,
          });

          this.MenuSeleccion = nombreSeleccion;
          let componenteMenu = menuInformacion.filter(
            (item) => item.name == nombreSeleccion
          );
          if (componenteMenu[0]?.children) {
            this.arrMenu = componenteMenu[0].children;
          }
        })
      )
      .subscribe();
  }
}
