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
import { FechasService } from '@comun/services/fechas.service';
import { HttpService } from '@comun/services/http.service';
import { AutocompletarRegistros } from '@interfaces/comunes/autocompletar/autocompletar';
import { AporteService } from '@modulos/humano/servicios/aporte.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { tap, zip } from 'rxjs';
import { TituloAccionComponent } from "../../../../../../comun/componentes/titulo-accion/titulo-accion.component";

@Component({
  selector: 'app-aporte-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    TranslateModule,
    NgbDropdownModule,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent
],
  templateUrl: './aporte-formulario.component.html',
  styleUrl: './aporte-formulario.component.scss',
})
export default class AporteFormularioComponent
  extends General
  implements OnInit
{
  formularioAporte: FormGroup;
  arrSucursales: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private aporteService: AporteService,
    protected fechasService: FechasService
  ) {
    super();
  }

  ngOnInit() {
    this.consultarInformacion();
    this.iniciarFormulario();
    if (this.detalle) {
      this.consultarDetalle();
    }
    this.changeDetectorRef.detectChanges();
  }

  iniciarFormulario() {
    const fechaActual = new Date();

    const anioActual = `${fechaActual.getFullYear()}`;
    const mesActual = `${fechaActual.getMonth()}`;

    this.formularioAporte = this.formBuilder.group({
      sucursal: [1, Validators.compose([Validators.required])],
      anio: [anioActual, Validators.compose([Validators.required])],
      mes: [mesActual, Validators.compose([Validators.required])],
    });
  }

  enviarFormulario() {
    if (this.formularioAporte.valid) {
      if (this.detalle) {
        this.aporteService
          .actualizarDatosAporte(this.detalle, this.formularioAporte.value)
          .subscribe((respuesta) => {
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.activatedRoute.queryParams.subscribe((parametros) => {
              this.router.navigate(['documento/detalle'], {
                queryParams: {
                  ...parametros,
                  detalle: respuesta.id,
                },
              });
            });
            this.changeDetectorRef.detectChanges();
          });
      } else {
        this.aporteService
          .guardarAporte(this.formularioAporte.value)
          .pipe(
            tap((respuesta: any) => {
              this.alertaService.mensajaExitoso('Se guardó la información');
              this.activatedRoute.queryParams.subscribe((parametros) => {
                this.router.navigate(['documento/detalle'], {
                  queryParams: {
                    ...parametros,
                    detalle: respuesta.id,
                  },
                });
              });
            })
          )
          .subscribe();
      }
    } else {
      this.formularioAporte.markAllAsTouched();
    }
  }

  consultarDetalle() {
    this.aporteService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioAporte.patchValue({
          sucursal: respuesta.sucursal_id,
          anio: respuesta.anio,
          mes: respuesta.mes,
        });
        this.changeDetectorRef.detectChanges();
      });
  }

  consultarInformacion() {
    zip(
      this.httpService.get<AutocompletarRegistros<any>>('humano/sucursal/')
    ).subscribe((respuesta: any) => {
      this.arrSucursales = respuesta[0];
      this.changeDetectorRef.detectChanges();
    });
  }
}
