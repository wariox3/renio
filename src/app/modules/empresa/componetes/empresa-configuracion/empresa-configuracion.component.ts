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
import { EmpresaFacturacionElectronicaComponent } from '../empresa-facturacion-electronica/empresa-facturacion-electronica.component';

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
    EmpresaFacturacionElectronicaComponent
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
      informacion_factura_superior: [
        null,
        Validators.compose([Validators.maxLength(2000)]),
      ],
      venta_asesor: [false],
      venta_sede: [false],
    });
  }

  consultarInformacion() {
    this.empresaService
      .obtenerConfiguracionEmpresa(1)
      .subscribe((respuesta: any) => {
        this.formularioEmpresa.patchValue({
          formato_factura: respuesta.formato_factura,
          informacion_factura: respuesta.informacion_factura,
          informacion_factura_superior: respuesta.informacion_factura_superior,
          venta_asesor: respuesta.venta_asesor,
          venta_sede: respuesta.venta_sede
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
