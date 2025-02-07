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
import { SoloNumerosDirective } from '@comun/directive/solo-numeros.directive';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { DocumentoDocumentoTipoComponent } from './componentes/documento-tipo/empresa-documento-tipo-lista/empresa-documento-tipo.component';
import { ImpuestosListaComponent } from './componentes/impuestos/impuestos-lista/impuestos-lista.component';

@Component({
  selector: 'app-configuracion-general',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SoloNumerosDirective,
    NgbNavModule,
    DocumentoDocumentoTipoComponent,
    ImpuestosListaComponent
  ],
  templateUrl: './configuracion-general.component.html',
})
export class ConfiguracionGeneralComponent extends General implements OnInit {

  formularioConfiguracion: FormGroup;
  tabActive = 1;

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
      gen_uvt: [
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
          gen_uvt: parseInt(respuesta.gen_uvt),
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
