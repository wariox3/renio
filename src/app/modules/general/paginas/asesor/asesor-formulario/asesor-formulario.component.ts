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
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { AsesorService } from '@modulos/general/servicios/asesor.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { TituloAccionComponent } from "../../../../../comun/componentes/titulo-accion/titulo-accion.component";
import { InputValueCaseDirective } from '@comun/directive/input-value-case.directive';

@Component({
  selector: 'app-asesor-formulario',
  standalone: true,
  templateUrl: './asesor-formulario.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    NgxMaskDirective,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
    InputValueCaseDirective
],
  providers: [provideNgxMask()],
})
export default class AsesorFormularioComponent
  extends General
  implements OnInit
{
  formularioAsesor: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private asesorService: AsesorService
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
    this.formularioAsesor = this.formBuilder.group({
      nombre_corto: [null, Validators.compose([])],
      celular: [
        null,
        Validators.compose([]),
      ],
      correo: [
        null,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.maxLength(255),
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        ]),
      ],
    });
  }

  get obtenerFormularioCampos() {
    return this.formularioAsesor.controls;
  }

  enviarFormulario() {
    if (this.formularioAsesor.valid) {
      if (this.detalle) {
        this.asesorService
          .actualizarDatos(this.detalle, this.formularioAsesor.value)
          .subscribe((respuesta) => {
            this.formularioAsesor.patchValue({
              nombre_corto: respuesta.nombre_corto,
              celular: respuesta.celular,
              correo: respuesta.correo,
            });
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.activatedRoute.queryParams.subscribe((parametro) => {
              this.router.navigate([`/administrador/detalle`], {
                queryParams: {
                  ...parametro,
                  detalle: respuesta.id,
                },
              });
            });
          });
      } else {
        this.asesorService
          .guardarAsesor(this.formularioAsesor.value)
          .subscribe((respuesta) => {
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.activatedRoute.queryParams.subscribe((parametro) => {
              this.router.navigate([`/administrador/detalle`], {
                queryParams: {
                  ...parametro,
                  detalle: respuesta.id,
                },
              });
            });
          });
      }
    } else {
      this.formularioAsesor.markAllAsTouched();
    }
  }

  consultarDetalle() {
    this.asesorService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta) => {
        this.formularioAsesor.patchValue({
          nombre_corto: respuesta.nombre_corto,
          celular: respuesta.celular,
          correo: respuesta.correo,
        });

        this.changeDetectorRef.detectChanges();
      });
  }
}
