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
import { MovimientoService } from '@modulos/contabilidad/servicios/movimiento.service';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { TituloAccionComponent } from "../../../../../../comun/componentes/titulo-accion/titulo-accion.component";

@Component({
  selector: 'app-movimiento-detalle',
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
  templateUrl: './movimiento-formulario.component.html',
})
export default class MovimientoFormularioComponent
  extends General
  implements OnInit
{
  formularioMovimiento: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private movimientoService: MovimientoService
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
    this.formularioMovimiento = this.formBuilder.group({
      nombre: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(200)]),
      ],
    });
  }

  formSubmit() {
    if (this.formularioMovimiento.valid) {
      if (this.detalle) {
        this.movimientoService
          .actualizarDatos(this.detalle, this.formularioMovimiento.value)
          .subscribe((respuesta) => {
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.router.navigate(['documento/detalle'], {
              queryParams: {
                ...this.parametrosUrl,
                detalle: respuesta.documento.id,
              },
            });
            this.changeDetectorRef.detectChanges();
          });
      } else {
        this.movimientoService
          .guardarMovimiento(this.formularioMovimiento.value)
          .pipe(
            tap((respuesta: any) => {
              this.alertaService.mensajaExitoso('Se guardó la información');
              this.router.navigate(['documento/detalle'], {
                queryParams: {
                  ...this.parametrosUrl,
                  detalle: respuesta.documento.id,
                },
              });
            })
          )
          .subscribe();
      }
    } else {
      this.formularioMovimiento.markAllAsTouched();
    }
  }

  consultardetalle() {
    this.movimientoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioMovimiento.patchValue({});
        this.changeDetectorRef.detectChanges();
      });
  }
}
