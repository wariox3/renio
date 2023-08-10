import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { General } from '@comun/clases/general';

@Component({
  selector: 'app-item-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TranslationModule,
  ],
  templateUrl: './item-formulario.component.html',
})
export class ItemFormularioComponent extends General implements OnInit {

  formularioItem: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
  ) {
    super();
  }
  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.formularioItem = this.formBuilder.group(
      {
        nombre: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(200),
            Validators.pattern(/^[a-z-0-9.-_]*$/),
          ]),
        ],
        impuestos: this.formBuilder.array([this.crearControlImpuesto()]) // Agregamos un control inicial
      },
    );
  }

  get formFields() {
    return this.formularioItem.controls;
  }

  get impuestos() {
    return this.formularioItem.get('impuestos') as FormArray;
  }

  private crearControlImpuesto(): FormControl {
    return this.formBuilder.control('');
  }

  agregarImpuesto() {
    this.impuestos.push(this.formBuilder.control(''));
  }

  eliminarImpuesto(index: number) {
    if(this.impuestos.length > 1){
      this.impuestos.removeAt(index);
    }
  }

  formSubmit() {
    if (this.formularioItem.valid) {
    //   this.renderer2.setAttribute(
    //     this.btnGuardar.nativeElement,
    //     'disabled',
    //     'true'
    //   );
    //   this.renderer2.setProperty(
    //     this.btnGuardar.nativeElement,
    //     'innerHTML',
    //     'Procesando'
    //   );
      // this.store
      //   .select(obtenerUsuarioId)
      //   .pipe(
      //     switchMap(([usuarioId]) =>
      //       this.httpService.post<Item>(
      //         'general/item/',
      //         {
      //           nombre: this.formFields.nombre.value
      //         },
      //       )
      //     )
      //   )
    //     .subscribe({
    //       next: (respuesta) => {
    //         this.renderer2.setAttribute(
    //           this.btnGuardar.nativeElement,
    //           'disabled',
    //           'true'
    //         );
    //         this.renderer2.setProperty(
    //           this.btnGuardar.nativeElement,
    //           'innerHTML',
    //           'Guardar'
    //         );
    //         this.alertaService.mensajaExitoso(
    //           this.translateService.instant("")
    //           //'Nueva empresa creada'
    //         );
    //       },
    //       error: ({ error }) => {
    //         this.renderer2.removeAttribute(
    //           this.btnGuardar.nativeElement,
    //           'disabled'
    //         );
    //         this.renderer2.setProperty(
    //           this.btnGuardar.nativeElement,
    //           'innerHTML',
    //           'Guardar'
    //         );
    //         this.alertaService.mensajeError(
    //           'Error consulta',
    //           `Código: ${error.codigo} <br/> Mensaje: ${error.mensaje}`
    //         );
    //       },
    //     });
     } else {
       this.formularioItem.markAllAsTouched();
     }
  }

  limpiarFormulario() {
    this.formularioItem.reset();
  }
}
