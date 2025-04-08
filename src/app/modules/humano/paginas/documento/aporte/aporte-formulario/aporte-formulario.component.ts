import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { GeneralService } from '@comun/services/general.service';
import { RegistroHumEntidadLista } from '@interfaces/comunes/autocompletar/humano/hum-entidad.interface';
import { NgSelectModule } from '@ng-select/ng-select';
import { Configuracion } from '@modulos/humano/interfaces/aporte';

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
    TituloAccionComponent,
    NgSelectModule,
    NgbDropdownModule,
  ],
  templateUrl: './aporte-formulario.component.html',
  styleUrl: './aporte-formulario.component.scss',
})
export default class AporteFormularioComponent
  extends General
  implements OnInit
{
  public presentacionLista = [
    {
      nombre: 'Sucursal',
      value: 'S',
    },
    {
      nombre: 'Única',
      value: 'U',
    },
  ];
  formularioAporte: FormGroup;
  arrSucursales: any = [];
  public listaEntidadesRiesgo: RegistroHumEntidadLista[] = [];
  public listaEntidadesSena: RegistroHumEntidadLista[] = [];
  public listaEntidadesIcbf: RegistroHumEntidadLista[] = [];

  private _generalService = inject(GeneralService);

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private aporteService: AporteService,
    protected fechasService: FechasService,
  ) {
    super();
  }

  ngOnInit() {
    this.consultarInformacion();
    this.iniciarFormulario();
    if (this.detalle) {
      this.consultarDetalle();
    } else {
      this._consultarEntidadRiesgoPredefinida();
    }

    this._consultarEntidadesRiesgoLista();
    this._consultarEntidadesSenaLista();
    this._consultarEntidadesIcbfLista();
    this.changeDetectorRef.detectChanges();
  }

  iniciarFormulario() {
    const fechaActual = new Date();

    const anioActual = `${fechaActual.getFullYear()}`;
    // se suma un + 1 debido a que el back solo permite valores entre 1..12
    const mesActual = fechaActual.getMonth() + 1;

    this.formularioAporte = this.formBuilder.group({
      sucursal: [1, Validators.compose([Validators.required])],
      anio: [anioActual, Validators.compose([Validators.required])],
      mes: [mesActual, Validators.compose([Validators.required])],
      presentacion: ['S', Validators.compose([Validators.required])],
      entidad_riesgo: [null, [Validators.required]],
      entidad_sena: [null, [Validators.required]],
      entidad_icbf: [null, [Validators.required]],
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
              this.router.navigate([`humano/proceso/detalle/${respuesta.id}`], {
                queryParams: {
                  ...parametros,
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
                this.router.navigate(
                  [`humano/proceso/detalle/${respuesta.id}`],
                  {
                    queryParams: {
                      ...parametros,
                    },
                  },
                );
              });
            }),
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
          presentacion: respuesta.presentacion,
          entidad_riesgo: respuesta.entidad_riesgo_id,
          entidad_sena: respuesta.entidad_sena_id,
          entidad_icbf: respuesta.entidad_icbf_id,
        });
        this.changeDetectorRef.detectChanges();
      });
  }

  consultarInformacion() {
    zip(
      this.httpService.get<AutocompletarRegistros<any>>('humano/sucursal/'),
    ).subscribe((respuesta: any) => {
      this.arrSucursales = respuesta[0];
      this.changeDetectorRef.detectChanges();
    });
  }

  private _consultarEntidadRiesgoPredefinida() {
    this._generalService
      .consultarConfiguracion<Configuracion>({
        campos: ['hum_entidad_riesgo'],
      })
      .subscribe({
        next: (response) => {
          if (response.configuracion?.length > 0) {
            const entidadRiesgoId =
              response.configuracion[0]?.hum_entidad_riesgo;
            this.formularioAporte.patchValue({
              entidad_riesgo: entidadRiesgoId,
            });
          }
        },
      });
  }

  private _consultarEntidadesRiesgoLista() {
    this._generalService
      .consultarDatosAutoCompletar<RegistroHumEntidadLista>({
        modelo: 'HumEntidad',
        filtros: [
          {
            operador: 'exact',
            propiedad: 'riesgo',
            valor1: true,
          },
        ],
      })
      .subscribe({
        next: (response) => {
          this.listaEntidadesRiesgo = response.registros;
          this.changeDetectorRef.detectChanges();
        },
      });
  }

  private _consultarEntidadesIcbfLista() {
    this._generalService
      .consultarDatosAutoCompletar<RegistroHumEntidadLista>({
        modelo: 'HumEntidad',
        filtros: [
          {
            operador: 'exact',
            propiedad: 'icbf',
            valor1: true,
          },
        ],
      })
      .subscribe({
        next: (response) => {
          this.listaEntidadesIcbf = response.registros;
          if (!this.detalle) {
            this._sugerirSeleccion(response.registros?.[0], 'entidad_icbf');
          }
          this.changeDetectorRef.detectChanges();
        },
      });
  }

  private _sugerirSeleccion(
    registro: RegistroHumEntidadLista,
    campo: 'entidad_icbf' | 'entidad_sena',
  ) {
    if (registro) {
      this.formularioAporte.patchValue({
        [campo]: registro.id,
      });
    }
  }

  private _consultarEntidadesSenaLista() {
    this._generalService
      .consultarDatosAutoCompletar<RegistroHumEntidadLista>({
        modelo: 'HumEntidad',
        filtros: [
          {
            operador: 'exact',
            propiedad: 'sena',
            valor1: true,
          },
        ],
      })
      .subscribe({
        next: (response) => {
          this.listaEntidadesSena = response.registros;
          if (!this.detalle) {
            this._sugerirSeleccion(response.registros?.[0], 'entidad_sena');
          }
          this.changeDetectorRef.detectChanges();
        },
      });
  }
}
