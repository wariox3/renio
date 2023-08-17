import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { ContactoFormulario } from '@interfaces/general/contacto';
import { ContactoFormularioComponent } from '../contacto-formulario/contacto-formulario.component';

@Component({
  selector: 'app-contacto-nuevo',
  standalone: true,
  templateUrl: './contacto-nuevo.component.html',
  styleUrls: ['./contacto-nuevo.component.scss'],
  imports:[
    ContactoFormularioComponent
  ]
})
export default class ContactoNuevoComponent extends General implements OnInit {

  informacionContacto: ContactoFormulario = {
    identificacion: 0,
    numero_identificacion: 0,
    nombre_corto: '',
    direccion: '',
    ciudad: 0,
    telefono: 0,
    celular: 0,
    tipo_persona: 0,
    regimen: 1
  };

  constructor(
    ) {
      super();
    }

  ngOnInit(): void {

  }

  enviarFormulario(dataFormularioLogin: ContactoFormulario) {

  }
}
