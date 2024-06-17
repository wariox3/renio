import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';

@Component({
  selector: 'app-empresa-configuracion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    TranslateModule,
  ],
  templateUrl: './empresa-configuracion.component.html',
})

export class EmpresaConfiguracionComponent extends General implements OnInit {
  formularioEmpresa: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService,
  ) {
    super();
  }

  ngOnInit() {
    this.initForm();
    this.consultarInformacion();
  }

  initForm() {
    this.formularioEmpresa = this.formBuilder.group({
      formato_factura: [''],
      informacion_factura: [
        null,
        Validators.compose([Validators.maxLength(2000)]),
      ],
      venta_asesor: [false],
    });
  }

  consultarInformacion() {
    this.empresaService
      .obtenerConfiguracionEmpresa(1)
      .subscribe((respuesta: any) => {
        this.formularioEmpresa.patchValue({
          formato_factura: respuesta.formato_factura,
          informacion_factura: respuesta.informacion_factura,
          venta_asesor: respuesta.venta_asesor
        });
      });
  }

  formSubmit() {
    if (this.formularioEmpresa.valid) {
      this.empresaService
        .configuracionEmpresa(1, this.formularioEmpresa.value)
        .pipe(
          tap((respuestaActualizacion: any) => {
            if (respuestaActualizacion.actualizacion) {
              this.alertaService.mensajaExitoso(
                this.translateService.instant(
                  'FORMULARIOS.MENSAJES.COMUNES.PROCESANDOACTUALIZACION'
                )
              );
            }
          })
        )
        .subscribe();
    } else {
      this.formularioEmpresa.markAllAsTouched();
    }
  }
}
