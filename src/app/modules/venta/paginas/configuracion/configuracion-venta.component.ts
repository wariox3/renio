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
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';

@Component({
  selector: 'app-configuracion-venta',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './configuracion-venta.component.html',
})
export class ConfiguracionVentaComponent extends General implements OnInit {
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
          informacion_factura: respuesta.informacion_factura,
          informacion_factura_superior: respuesta.informacion_factura_superior,
          venta_asesor: respuesta.venta_asesor,
          venta_sede: respuesta.venta_sede,
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
                  'FORMULARIOS.MENSAJES.COMUNES.PROCESANDOACTUALIZACION',
                ),
              );
            }
          }),
        )
        .subscribe();
    } else {
      this.formularioEmpresa.markAllAsTouched();
    }
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioEmpresa?.markAsDirty();
    this.formularioEmpresa?.markAsTouched();
    if (campo === 'informacion_factura') {
      if (this.formularioEmpresa.get(campo)?.value === '') {
        this.formularioEmpresa.get(campo)?.setValue(null);
      }
    }
    if (campo === 'informacion_factura_superior') {
      if (this.formularioEmpresa.get(campo)?.value === '') {
        this.formularioEmpresa.get(campo)?.setValue(null);
      }
    }
    this.changeDetectorRef.detectChanges();
  }
}
