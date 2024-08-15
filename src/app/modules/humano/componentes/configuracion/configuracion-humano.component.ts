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
import { SoloNumerosDirective } from '@comun/Directive/solo-numeros.directive';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';

@Component({
  selector: 'app-configuracion-humano',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SoloNumerosDirective,
  ],
  templateUrl: './configuracion-humano.component.html',
})
export class ConfiguracionHumanoComponent extends General implements OnInit {
  formularioConfiguracion: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService
  ) {
    super();
  }

  ngOnInit() {
    this.consultarInformacion();
    this.initForm();
  }

  initForm() {
    this.formularioConfiguracion = this.formBuilder.group({
      hum_factor: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(6),
          Validators.pattern(/^[0-9.,]+$/),
        ]),
      ],
      hum_salario_minimo: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(20)]),
      ],
      hum_auxilio_transporte: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(20)]),
      ],
    });
  }

  consultarInformacion() {
    this.empresaService
      .obtenerConfiguracionEmpresa(1)
      .subscribe((respuesta: any) => {
        this.formularioConfiguracion.patchValue({
          hum_factor: respuesta.hum_factor,
          hum_salario_minimo: parseInt(respuesta.hum_salario_minimo),
          hum_auxilio_transporte: parseInt(respuesta.hum_auxilio_transporte),
        });
      });
  }

  formSubmit() {
    if (this.formularioConfiguracion.valid) {
      this.empresaService
        .configuracionEmpresa(1, this.formularioConfiguracion.value)
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
      this.formularioConfiguracion.markAllAsTouched();
    }
  }
}
