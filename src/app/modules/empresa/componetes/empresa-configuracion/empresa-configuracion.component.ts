import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-empresa-configuracion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
  ],
  templateUrl: './empresa-configuracion.component.html',
})
export class EmpresaConfiguracionComponent implements OnInit { 

  formularioEmpresa: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.formularioEmpresa = this.formBuilder.group({
      formata_factura: [''],
    });
  }

  formSubmit() {
    if (this.formularioEmpresa.valid) {
      // this.empresaService
      //   .actualizarDatosEmpresa(1, this.formularioEmpresa.value)
      //   .pipe(
      //     tap((respuestaActualizacion: any) => {
      //       if (respuestaActualizacion.actualizacion) {
      //         this.alertaService.mensajaExitoso(
      //           this.translateService.instant(
      //             'FORMULARIOS.MENSAJES.COMUNES.PROCESANDOACTUALIZACION'
      //           )
      //         );
      //         this.store.dispatch(
      //           empresaActualizacionAction({
      //             empresa: respuestaActualizacion.empresa,
      //           })
      //         );
      //       }
      //     })
      //   )
      //   .subscribe();
    } else {
      // this.formularioEmpresa.markAllAsTouched();
    }
  }
}
