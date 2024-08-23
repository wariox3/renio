import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
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
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TranslateModule } from '@ngx-translate/core';
import { SedeService } from '@modulos/general/servicios/sede.service';

@Component({
  selector: 'app-sede-formulario',
  standalone: true,
  templateUrl: './sede-formulario.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    BtnAtrasComponent,
    CardComponent,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [provideNgxMask()],
})
export default class AsesorFormularioComponent
  extends General
  implements OnInit
{
  formularioSede: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private sedeService: SedeService
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
    this.formularioSede = this.formBuilder.group({
      nombre: [null, Validators.compose([Validators.required])]
    });
  }

  get obtenerFormularioCampos() {
    return this.formularioSede.controls;
  }

  enviarFormulario() {
    if (this.formularioSede.valid) {
      if (this.detalle) {
        this.sedeService
          .actualizarDatos(this.detalle, this.formularioSede.value)
          .subscribe((respuesta: any) => {
            this.formularioSede.patchValue({
              nombre: respuesta.nombre,
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
        this.sedeService
          .guardarSede(this.formularioSede.value)
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
      this.formularioSede.markAllAsTouched();
    }
  }

  consultarDetalle() {
    this.sedeService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioSede.patchValue({
          nombre: respuesta.nombre,
        });

        this.changeDetectorRef.detectChanges();
      });
  }
}
