import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { BuscarAvanzadoComponent } from '@comun/componentes/buscar-avanzado/buscar-avanzado.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { HttpService } from '@comun/services/http.service';
import { cambiarVacioPorNulo } from '@comun/validaciones/campoNoObligatorio';
import {
  AutocompletarRegistros,
  RegistroAutocompletarHumGrupo,
  RegistroAutocompletarHumPagoTipo,
} from '@interfaces/comunes/autocompletar';
import { ProgramacionService } from '@modulos/humano/servicios/programacion';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { tap, zip } from 'rxjs';

@Component({
  selector: 'app-programacion-formulario',
  standalone: true,
  imports: [
    CommonModule,
    BtnAtrasComponent,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    TranslateModule,
    NgbDropdownModule,
    BuscarAvanzadoComponent,
  ],
  templateUrl: './programacion-formulario.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContratoFormularioComponent
  extends General
  implements OnInit
{
  formularioProgramacion: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private programacionService: ProgramacionService
  ) {
    super();
  }

  arrPagoTipo: any[];
  arrGrupo: any[];

  ngOnInit() {
    this.consultarInformacion();
    this.iniciarFormulario();
    if (this.detalle) {
      this.consultarDetalle();
    }
    this.changeDetectorRef.detectChanges();
  }

  iniciarFormulario() {
    const fechaActual = new Date(); // Obtener la fecha actual
    const primerDiaMes = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth(),
      1
    );
    const ultimoDiaMes = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth() + 1,
      0
    );

    const fechaDesde = `${primerDiaMes.getFullYear()}-${(
      primerDiaMes.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${primerDiaMes.getDate().toString().padStart(2, '0')}`;

    this.formularioProgramacion = this.formBuilder.group(
      {
        fecha_desde: [
          fechaDesde,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(200),
            Validators.pattern(/^[a-z-0-9.-_]*$/),
          ]),
        ],
        fecha_hasta: [
          fechaDesde,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(200),
            Validators.pattern(/^[a-z-0-9.-_]*$/),
          ]),
        ],
        fecha_hasta_periodo: [
          fechaDesde,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(200),
            Validators.pattern(/^[a-z-0-9.-_]*$/),
          ]),
        ],
        pago_tipo: [1, Validators.compose([Validators.required])],
        grupo: [1, Validators.compose([Validators.required])],
        nombre: [null, Validators.compose([cambiarVacioPorNulo.validar])],
        descuento_salud: [true],
        descuento_pension: [true],
        descuento_fondo_solidaridad: [true],
        descuento_retencion_fuente: [true],
        pago_incapacidad: [true],
        pago_licencia: [true],
        pago_vacacion: [true],
        pago_horas: [true],
        pago_auxilio_transporte: [true],
        descuento_credito: [true],
        descuento_embargo: [true],
        adicional: [true],
        comentario: [
          null,
          Validators.compose([
            Validators.maxLength(500),
            cambiarVacioPorNulo.validar,
          ]),
        ],
      },
      {
        validator: this.fechaDesdeMenorQueFechaHasta(
          'fecha_desde',
          'fecha_hasta'
        ),
      }
    );
  }

  consultarInformacion() {
    zip(
      this.httpService.post<
        AutocompletarRegistros<RegistroAutocompletarHumPagoTipo>
      >('general/funcionalidad/lista/', {
        filtros: [
          {
            operador: '__icontains',
            propiedad: 'nombre__icontains',
            valor1: ``,
            valor2: '',
          },
        ],
        limite: 0,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: 'HumPagoTipo',
        serializador: "ListaAutocompletar"
      }),
      this.httpService.post<
        AutocompletarRegistros<RegistroAutocompletarHumGrupo>
      >('general/funcionalidad/lista/', {
        filtros: [
          {
            operador: '__icontains',
            propiedad: 'nombre__icontains',
            valor1: ``,
            valor2: '',
          },
        ],
        limite: 0,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: 'HumGrupo',
      })
    ).subscribe((respuesta: any) => {
      this.arrPagoTipo = respuesta[0].registros;
      this.arrGrupo = respuesta[1].registros;
      this.changeDetectorRef.detectChanges();
    });
  }

  enviarFormulario() {
    if (this.formularioProgramacion.valid) {
      if (this.detalle) {
        this.programacionService
          .actualizarDatosProgramacion(
            this.detalle,
            this.formularioProgramacion.value
          )
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
        this.programacionService
          .guardarProgramacion(this.formularioProgramacion.value)
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
      this.formularioProgramacion.markAllAsTouched();
    }
  }

  consultarDetalle() {
    this.programacionService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioProgramacion.patchValue({
          fecha_desde: respuesta.fecha_desde,
          fecha_hasta: respuesta.fecha_hasta,
          fecha_hasta_periodo: respuesta.fecha_hasta_periodo,
          nombre: respuesta.nombre,
          pago_tipo: respuesta.pago_tipo_id,
          grupo: respuesta.grupo_id,
          descuento_salud: respuesta.descuento_salud,
          descuento_pension: respuesta.descuento_pension,
          descuento_fondo_solidaridad: respuesta.descuento_fondo_solidaridad,
          descuento_retencion_fuente: respuesta.descuento_retencion_fuente,
          pago_incapacidad: respuesta.pago_incapacidad,
          pago_licencia: respuesta.pago_licencia,
          pago_vacacion: respuesta.pago_vacacion,
          pago_horas: respuesta.pago_horas,
          pago_auxilio_transporte: respuesta.pago_auxilio_transporte,
          descuento_credito: respuesta.descuento_credito,
          descuento_embargo: respuesta.descuento_embargo,
          adicional: respuesta.adicional,
          comentario: respuesta.comentario,
          dias: respuesta.dias,
          cantidad: respuesta.contratos,
        });
        this.changeDetectorRef.detectChanges();
      });
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioProgramacion?.markAsDirty();
    this.formularioProgramacion?.markAsTouched();
    if (campo === 'fecha_hasta_periodo') {
      this.formularioProgramacion.get(campo)?.setValue(dato);
    }
    this.changeDetectorRef.detectChanges();
  }

  fechaDesdeMenorQueFechaHasta(
    fechaDesde: string,
    fechaHasta: string
  ): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const desde = formGroup.get(fechaDesde)?.value;
      const hasta = formGroup.get(fechaHasta)?.value;

      // Comprobar si las fechas son válidas y si "fecha_desde" es mayor que "fecha_hasta"
      if (desde && hasta && new Date(desde) > new Date(hasta)) {
        return { fechaInvalida: true };
      }
      return null;
    };
  }
}
