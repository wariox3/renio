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
import { ConceptoService } from '@modulos/humano/servicios/concepto.service';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { TituloAccionComponent } from "../../../../../../comun/componentes/titulo-accion/titulo-accion.component";

@Component({
  selector: 'app-concepto',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    TranslateModule,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent
],
  templateUrl: './concepto-formulario.component.html',
  styleUrl: './concepto-formulario.component.scss',
})
export default class ConceptoFormularioComponent
  extends General
  implements OnInit
{
  formularioConcepto: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private conceptoService: ConceptoService
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
    this.formularioConcepto = this.formBuilder.group({
      nombre: ['', Validators.compose([Validators.required])],
      ingreso_base_cotizacion: [false],
      ingreso_base_prestacion: [false],
      porcentaje: [0, Validators.compose([Validators.required])],
      orden: [0, Validators.compose([Validators.required])],
    });
  }

  enviarFormulario() {
    if (this.formularioConcepto.valid) {
      if (this.detalle) {
        this.conceptoService
          .actualizarDatosConcepto(this.detalle, this.formularioConcepto.value)
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
            this.changeDetectorRef.detectChanges();
          });
      } else {
        this.conceptoService
          .guardarConcepto(this.formularioConcepto.value)
          .pipe(
            tap((respuesta: any) => {
              this.alertaService.mensajaExitoso('Se guardó la información');
              this.activatedRoute.queryParams.subscribe((parametro) => {
                this.router.navigate([`/administrador/detalle`], {
                  queryParams: {
                    ...parametro,
                    detalle: respuesta.id,
                  },
                });
              });
            })
          )
          .subscribe();
      }
    } else {
      this.formularioConcepto.markAllAsTouched();
    }
  }

  consultarDetalle() {
    this.conceptoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioConcepto.patchValue({
          nombre: respuesta.nombre,
          ingreso_base_cotizacion: respuesta.ingreso_base_cotizacion,
          ingreso_base_prestacion: respuesta.ingreso_base_prestacion,
          porcentaje: `${parseFloat(respuesta.porcentaje.replace(",", "."))}`,
          orden: respuesta.orden,
        });
        this.changeDetectorRef.detectChanges();
      });
  }

}
