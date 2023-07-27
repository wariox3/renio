import { Component, OnInit } from '@angular/core';
import { ContactoFormulario } from '@interfaces/general/contacto';

@Component({
  selector: 'app-contacto-nuevo',
  templateUrl: './contacto-nuevo.component.html',
  styleUrls: ['./contacto-nuevo.component.scss']
})
export class ContactoNuevoComponent implements OnInit {

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

  ngOnInit(): void {
    
  }

  enviarFormulario(dataFormularioLogin: ContactoFormulario) {

  }
}
