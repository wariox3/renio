import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactoFormulario } from '@interfaces/general/contacto';

@Component({
  selector: 'app-contacto-formulario',
  templateUrl: './contacto-formulario.component.html',
  styleUrls: ['./contacto-formulario.component.scss'],
})
export class ContactoFormularioComponent implements OnInit {
  formularioContacto: FormGroup;
  @Input() informacionContacto!: ContactoFormulario ;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.formularioContacto = this.formBuilder.group({
      identificacion: [
        this.informacionContacto.identificacion,
          Validators.compose([
            Validators.minLength(1),
            Validators.maxLength(3)
          ])
      ],
      numero_identificacion: [
        this.informacionContacto.numero_identificacion,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ])
      ],
      nombre_corto: [

      ],
      direccion: [
        
      ],
      ciudad: [

      ],
      telefono: [

      ],
      celular: [

      ],
      tipo_persona: [

      ],
      regimen: [

      ]
    });
  }
}
