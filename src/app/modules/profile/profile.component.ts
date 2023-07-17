import { Component } from '@angular/core';
import { obtenerEmpresaNombre } from '@redux/selectors/empresa-nombre.selectors';
import { obtenerUsuarioCorreo } from '@redux/selectors/usuario-correo.selectors';
import { obtenerUsuarioNombreCompleto } from '@redux/selectors/usuario-nombre-completo.selectors';
import { obtenerUsuarioNombreCorto } from '@redux/selectors/usuario-nombre-corto.selectors';
import { obtenerUsuarioTelefono } from '@redux/selectors/usuario-telefono.selectors';
import { General } from '@comun/clases/general';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent extends General {

  constructor() {
    super()
  }

  empresaNombre = this.store.select(obtenerEmpresaNombre);
  usuarioCorreo = this.store.select(obtenerUsuarioCorreo);
  nombreMostrar = this.store.select(obtenerUsuarioNombreCorto);
  telefono = this.store.select(obtenerUsuarioTelefono);
  usuarioNombreCompleto = this.store.select(obtenerUsuarioNombreCompleto);


}
