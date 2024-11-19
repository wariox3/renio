import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezadoFormularioNuevo/encabezadoFormularioNuevo.component';
import { PrecioService } from '@modulos/general/servicios/precio.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-precio-formulario',
  standalone: true,
  templateUrl: './precio-formulario.component.html',
  imports: [
    CommonModule,
    CardComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    EncabezadoFormularioNuevoComponent
],
})
export default class PrecioFormularioComponent
  extends General
  implements OnInit
{
  formularioPrecio: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private precioService: PrecioService
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
    const fechaActual = new Date(); // Obtener la fecha actual
    const fechaVencimientoInicial = `${fechaActual.getFullYear()}-${(
      fechaActual.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}`;
    this.formularioPrecio = this.formBuilder.group({
      tipo: ['', Validators.compose([Validators.required])],
      nombre: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(100)]),
      ],
      fecha_vence: [
        fechaVencimientoInicial,
        Validators.compose([Validators.required]),
      ],
      detalles: this.formBuilder.array([]),
    });
  }

  get detalles() {
    return this.formularioPrecio.get('detalles') as FormArray;
  }

  enviarFormulario() {
    if (this.formularioPrecio.valid) {
      if (this.detalle) {
        this.precioService
          .actualizarDatos(this.detalle, this.formularioPrecio.value)
          .subscribe((respuesta: any) => {
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
        this.precioService
          .guardarPrecio(this.formularioPrecio.value)
          .subscribe((respuesta: any) => {
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
      this.formularioPrecio.markAllAsTouched();
    }
  }

  consultardetalle() {
    this.precioService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioPrecio.patchValue({
          nombre: respuesta.nombre,
          tipo: respuesta.tipo,
          fecha_vence: respuesta.fecha_vence,
        });

        this.changeDetectorRef.detectChanges();
      });
  }
}
