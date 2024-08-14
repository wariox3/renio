import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { General } from '@comun/clases/general';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-configuracion-humano',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './configuracion-humano.component.html',
})
export class ConfiguracionHumanoComponent extends General implements OnInit {
  formularioConfiguracion: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
  ) {
    super();
  }

  ngOnInit() {
    this.initForm();
    this.consultarInformacion();
  }

  initForm() {
    this.formularioConfiguracion = this.formBuilder.group({
      factor: ['', Validators.required],
    });
  }

  consultarInformacion() {
    // this.empresaService
    //   .obtenerConfiguracionEmpresa(1)
    //   .subscribe((respuesta: any) => {
    //     this.formularioEmpresa.patchValue({
    //       factor: respuesta.formato_factura,
    //     });
    //   });
  }

  formSubmit() {
    if (this.formularioConfiguracion.valid) {
      // this.empresaService
      //   .configuracionEmpresa(1, this.formularioConfiguracion.value)
      //   .pipe(
      //     tap((respuestaActualizacion: any) => {
      //       if (respuestaActualizacion.actualizacion) {
      //         this.alertaService.mensajaExitoso(
      //           this.translateService.instant(
      //             'FORMULARIOS.MENSAJES.COMUNES.PROCESANDOACTUALIZACION'
      //           )
      //         );
      //       }
      //     })
      //   )
      //   .subscribe();
    } else {
      this.formularioConfiguracion.markAllAsTouched();
    }
  }


 }
