import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { obtenerUsuarioImagen } from '@redux/selectors/usuario.selectors';
import { UserInnerComponent } from '../../../../partials/layout/extras/dropdown-inner/user-inner/user-inner.component';
import { ThemeModeSwitcherComponent } from '../../../../partials/layout/theme-mode-switcher/theme-mode-switcher.component';
import { KeeniconComponent } from '../../../../shared/keenicon/keenicon.component';
import { QuickLinksInnerComponent } from 'src/app/_metronic/partials/layout/extras/dropdown-inner/quick-links-inner/quick-links-inner.component';
import { obtenerContenedorSeleccion } from '@redux/selectors/contenedor.selectors';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    ThemeModeSwitcherComponent,
    UserInnerComponent,
    KeeniconComponent,
    AsyncPipe,
    QuickLinksInnerComponent
  ],
})
export class NavbarComponent implements OnInit {
  @Input() appHeaderDefaulMenuDisplay: boolean;
  @Input() isRtl: boolean;

  itemClass: string = 'ms-1 ms-lg-3';
  btnClass: string =
    'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px';
  userAvatarClass: string = 'symbol-35px symbol-md-40px';
  btnIconClass: string = 'fs-2 fs-md-1';
  usuarioImagen$ = this.store.select(obtenerUsuarioImagen);
  contenedorSeleccion$ = this.store.select(obtenerContenedorSeleccion)


  constructor(private store: Store) {}

  ngOnInit(): void {}
}
