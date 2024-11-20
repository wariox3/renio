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
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezadoFormularioNuevo/encabezadoFormularioNuevo.component';
import { CargoService } from '@modulos/humano/servicios/cargo.service';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { TituloAccionComponent } from "../../../../../../comun/componentes/titulo-accion/titulo-accion.component";

@Component({
  selector: 'app-cargo-formulario',
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
  templateUrl: './cargo-formulario.component.html',
  styleUrl: './cargo-formulario.component.scss',
})
export default class CargoFormularioComponent
  extends General
  implements OnInit
{
  formularioCargo: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private cargoService: CargoService
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
    this.formularioCargo = this.formBuilder.group({
      nombre: ['', Validators.compose([Validators.required])],
      estado_inactivo: [false],
      codigo: [0, Validators.compose([Validators.required])],
    });
  }

  consultarDetalle() {
    this.cargoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioCargo.patchValue({
          nombre: respuesta.nombre,
          estado_inactivo: respuesta.estado_inactivo,
          codigo: respuesta.codigo,
        });
        this.changeDetectorRef.detectChanges();
      });
  }


  enviarFormulario() {
    if (this.formularioCargo.valid) {
      if (this.detalle) {
        this.cargoService
          .actualizarDatosCargo(this.detalle, this.formularioCargo.value)
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
        this.cargoService
          .guardarCargo(this.formularioCargo.value)
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
      this.formularioCargo.markAllAsTouched();
    }
  }

}
