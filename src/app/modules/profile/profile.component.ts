import { Component } from '@angular/core';
import { obtenerEmpresaNombre } from '@redux/selectors/empresa.selectors';
import {
  obtenerUsuarioNombre,
  obtenerUsuarioNombreCompleto,
  obtenerUsuarioNombreCorto,
  obtenerUsuarioTelefono,
} from '@redux/selectors/usuario.selectors';

import { General } from '@comun/clases/general';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent extends General {
  constructor() {
    super();
  }

  empresaNombre = this.store.select(obtenerEmpresaNombre);
  usuarioCorreo = this.store.select(obtenerUsuarioNombre);
  nombreMostrar = this.store.select(obtenerUsuarioNombreCorto);
  telefono = this.store.select(obtenerUsuarioTelefono);
  usuarioNombreCompleto = this.store.select(obtenerUsuarioNombreCompleto);
}
