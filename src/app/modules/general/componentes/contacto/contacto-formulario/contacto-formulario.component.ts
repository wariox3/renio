import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { General } from '@comun/clases/general';
import { ContactoFormulario } from '@interfaces/general/contacto';
import { HttpService } from '@comun/services/http.service';

@Component({
  selector: 'app-contacto-formulario',
  templateUrl: './contacto-formulario.component.html',
  styleUrls: ['./contacto-formulario.component.scss'],
})
export class ContactoFormularioComponent extends General implements OnInit {
  formularioContacto: FormGroup;
  @Input() informacionContacto!: ContactoFormulario;

  arrIdentificacion: ContactoFormulario[] = [];

  constructor(private formBuilder: FormBuilder, private httpService: HttpService) {
    super();

  }

  ngOnInit() {
    this.initForm();
    this.obtenerTipoDocumento();
  }

  initForm() {
    this.formularioContacto = this.formBuilder.group({
      identificacion: [
        this.informacionContacto.identificacion,
        Validators.compose([Validators.minLength(1), Validators.maxLength(3)]),
      ],
      numero_identificacion: [
        this.informacionContacto.numero_identificacion,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ]),
      ],
      nombre_corto: [
        this.informacionContacto.nombre_corto,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
      direccion: [
        this.informacionContacto.direccion,
        Validators.compose([
          Validators.minLength(3),
          Validators.maxLength(255),
        ]),
      ],
      ciudad: [
        this.informacionContacto.ciudad,
        Validators.compose([Validators.minLength(3), Validators.maxLength(5)]),
      ],
      telefono: [
        this.informacionContacto.telefono,
        Validators.compose([Validators.minLength(3), Validators.maxLength(50)]),
      ],
      celular: [
        this.informacionContacto.celular,
        Validators.compose([Validators.minLength(3), Validators.maxLength(50)]),
      ],
      tipo_persona: [
        this.informacionContacto.tipo_persona,
        Validators.compose([Validators.minLength(1)]),
      ],
      regimen: [
        this.informacionContacto.regimen,
        Validators.compose([Validators.minLength(1)]),
      ],
      tipo_documento: [this.informacionContacto.identificacion, Validators.required],
    });
  }

  get formFields() {
    return this.formularioContacto.controls;
  }

  formSubmit() {
    // if (this.formularioContacto.valid) {
    // } else {
    //   this.formularioContacto.markAllAsTouched();
    // }
  }

  // limpiarFormulario() {
  //   this.formularioContacto.reset();
  // }

  obtenerTipoDocumento() {
    // this.httpService.get<any>('general/identificacion/').subscribe((respuesta) => {
    //   this.arrIdentificacion = respuesta;
    //   this.changeDetectorRef.detectChanges();
    // });

    // Simulando la respuesta de la API que proporcionaste
    // const apiResponse = [
    //   {
    //     "id": 1,
    //     "nombre": "Registro civil de nacimiento"
    //   },
    //   {
    //     "id": 2,
    //     "nombre": "Tarjeta de identidad"
    //   },
    // ];

    // Asigna la lista de opciones a la variable

  }
}
