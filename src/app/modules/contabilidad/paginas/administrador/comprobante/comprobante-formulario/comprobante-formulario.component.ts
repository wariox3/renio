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
import { cambiarVacioPorNulo } from '@comun/validaciones/campo-no-obligatorio.validator';
import { ComprobanteService } from '@modulos/contabilidad/servicios/comprobante.service';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { TituloAccionComponent } from "../../../../../../comun/componentes/titulo-accion/titulo-accion.component";

@Component({
  selector: 'app-comprobante-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent
],
  templateUrl: './comprobante-formulario.component.html',
  styleUrl: './comprobante-formulario.component.scss',
})
export default class ComprobanteFormularioComponent
  extends General
  implements OnInit
{
  formularioComprobante: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private comprobanteService: ComprobanteService
  ) {
    super();
  }

  ngOnInit() {
    this.iniciarFormulario();
    if (this.detalle) {
      this.consultardetalle();
    }
  }

  iniciarFormulario() {
    this.formularioComprobante = this.formBuilder.group({
      nombre: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(100)]),
      ],
      codigo: [
        null,
        Validators.compose([
          Validators.maxLength(20),
          cambiarVacioPorNulo.validar,
        ]),
      ],
      permite_asiento: [false],
    });
  }

  formSubmit() {
    if (this.formularioComprobante.valid) {
      if (this.detalle) {
        this.comprobanteService
          .actualizarDatos(this.detalle, this.formularioComprobante.value)
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
        this.comprobanteService
          .guardarComprobante(this.formularioComprobante.value)
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
      this.formularioComprobante.markAllAsTouched();
    }
  }

  consultardetalle() {
    this.comprobanteService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioComprobante.patchValue({
          nombre: respuesta.nombre,
          codigo: respuesta.codigo,
          permite_asiento: respuesta.permite_asiento,
        });
        this.changeDetectorRef.detectChanges();
      });
  }
}
