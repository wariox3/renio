import { CommonModule, } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-asesor-formulario',
  standalone: true,
  template: '',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    BtnAtrasComponent,
    CardComponent
  ]
})
export default class AsesorFormularioComponent extends General implements OnInit  { 
  formularioAsesor: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
    this.iniciarFormulario();

    if (this.detalle) {
      this.consultarDetalle();
    }
  }

  iniciarFormulario() {
    this.formularioAsesor =  this.formBuilder.group({
      nombre_corto: [null, Validators.compose([Validators.required])],
      celular: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      correo: [null, Validators.compose([Validators.email, Validators.maxLength(255), Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)])]
    })
  }

  consultarDetalle() {
    
  }

}
