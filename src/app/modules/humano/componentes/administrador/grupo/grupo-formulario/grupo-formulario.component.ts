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
import { HttpService } from '@comun/services/http.service';
import {
  AutocompletarRegistros,
  RegistroAutocompletarHumPerido,
} from '@interfaces/comunes/autocompletar';
import { GrupoService } from '@modulos/humano/servicios/grupo.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { map, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-grupo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    TranslateModule,
    NgSelectModule,
    EncabezadoFormularioNuevoComponent
],
  templateUrl: './grupo-formulario.component.html',
  styleUrl: './grupo-formulario.component.scss',
})
export default class GrupoFormularioComponent
  extends General
  implements OnInit
{
  formularioGrupo: FormGroup;
  listaPeriodos$: Observable<any> = new Observable();

  constructor(
    private formBuilder: FormBuilder,
    private grupoService: GrupoService,
    private httpService: HttpService
  ) {
    super();
  }

  ngOnInit() {
    this.iniciarFormulario();
    this.consultarPeriodos();

    if (this.detalle) {
      this.consultarDetalle();
    }
  }

  iniciarFormulario() {
    this.formularioGrupo = this.formBuilder.group({
      nombre: ['', Validators.compose([Validators.required])],
      periodo: [null, Validators.compose([Validators.required])],
    });
  }

  consultarPeriodos() {
    this.listaPeriodos$ = this.httpService
      .post<AutocompletarRegistros<RegistroAutocompletarHumPerido>>(
        'general/funcionalidad/lista/',
        {
          limite_conteo: 10000,
          modelo: 'HumPeriodo',
          serializador: 'ListaAutocompletar',
        }
      )
      .pipe(map((respuesta) => respuesta.registros));
  }

  enviarFormulario() {
    if (this.formularioGrupo.valid) {
      if (this.detalle) {
        this.grupoService
          .actualizarDatosGrupo(this.detalle, this.formularioGrupo.value)
          .subscribe((respuesta) => {
            this.formularioGrupo.patchValue({
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
        this.grupoService
          .guardarGrupo(this.formularioGrupo.value)
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
      this.formularioGrupo.markAllAsTouched();
    }
  }

  consultarDetalle() {
    this.grupoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioGrupo.patchValue({
          nombre: respuesta.nombre,
          periodo: respuesta.periodo,
        });

        this.changeDetectorRef.detectChanges();
      });
  }
}
