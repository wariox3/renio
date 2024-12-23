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
import { AlmacenService } from '@modulos/inventario/service/almacen.service';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';

@Component({
  selector: 'app-almacen-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    TranslateModule,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
  ],
  templateUrl: './almacen-formulario.component.html',
  styleUrl: './almacen-formulario.component.scss',
})
export default class AlmacenFormularioComponent
  extends General
  implements OnInit
{
  formularioAlmacen: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private almacenService: AlmacenService
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
    this.formularioAlmacen = this.formBuilder.group({
      nombre: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(80)]),
      ],
    });
  }

  enviarFormulario() {
    if (this.formularioAlmacen.valid) {
      if (this.detalle) {
        this.almacenService
          .actualizarDatosGrupo(this.detalle, this.formularioAlmacen.value)
          .subscribe((respuesta) => {
            this.formularioAlmacen.patchValue({
              empleado: respuesta.contacto_id,
              empleadoNombre: respuesta.contado_nombre_corto,
              fecha_desde: respuesta.fecha_desde,
              fecha_hasta: respuesta.fecha_hasta,
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
            this.changeDetectorRef.detectChanges();
          });
      } else {
        this.almacenService
          .guardarAlacen(this.formularioAlmacen.value)
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
      this.formularioAlmacen.markAllAsTouched();
    }
  }

  consultarDetalle() {
    this.almacenService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioAlmacen.patchValue({
          nombre: respuesta.nombre,
        });

        this.changeDetectorRef.detectChanges();
      });
  }
}
