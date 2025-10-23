import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
import { CardComponent } from '@comun/componentes/card/card.component';
import { TituloAccionComponent } from '@comun/componentes/titulo-accion/titulo-accion.component';
import { FechasService } from '@comun/services/fechas.service';
import { GeneralService } from '@comun/services/general.service';
import {
  RegistroAutocompletarGenCuentaBancoClase,
  RegistroAutocompletarGenCuentaBancoTipo,
} from '@interfaces/comunes/autocompletar/general/gen-cuenta-banco.interface';
import { ConciliacionService } from '@modulos/contabilidad/servicios/conciliacion.service';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, zip } from 'rxjs';

@Component({
  selector: 'app-conciliacion-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    NgbDropdownModule,
    NgSelectModule,
    TituloAccionComponent,
  ],
  templateUrl: './conciliacion-formulario.component.html',
  styleUrl: './conciliacion-formulario.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ConciliacionFormularioComponent
  extends General
  implements OnInit, OnDestroy {
  formularioConciliacion: FormGroup;
  arrCuentasTipos: RegistroAutocompletarGenCuentaBancoTipo[];
  arrCuentasBancos: RegistroAutocompletarGenCuentaBancoClase[];
  selectedDateIndex: number = -1;
  visualizarCampoNumeroCuenta = false;
  public cuentaCobrarCodigo = '';
  public cuentaCobrarNombre = '';
  public ciudadDropdown: NgbDropdown;
  private readonly _generalService = inject(GeneralService);
  private _fechasService = inject(FechasService);
  private _destroy$ = new Subject<void>()

  constructor(
    private formBuilder: FormBuilder,
    private conciliacionService: ConciliacionService
  ) {
    super();
  }

  ngOnInit() {
    this.consultarInformacion();
    this.iniciarFormulario();

    if (this.detalle) {
      this.consultarDetalle();
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.unsubscribe();
  }

  consultarInformacion() {
    zip(
      this._generalService.consultaApi<RegistroAutocompletarGenCuentaBancoTipo[]>(
        'general/cuenta_banco_tipo/seleccionar/',
      ),
      this._generalService.consultaApi<RegistroAutocompletarGenCuentaBancoClase[]>(
        'general/cuenta_banco_clase/seleccionar/',
      )
    ).subscribe((respuesta) => {
      this.arrCuentasTipos = respuesta[0];
      this.arrCuentasBancos = respuesta[1];
      this.changeDetectorRef.detectChanges();
    });
  }

  iniciarFormulario() {
    const fechaActual = this._fechasService.obtenerFechaActualFormateada();
    this.formularioConciliacion = this.formBuilder.group({
      fecha_desde: [
        fechaActual,
        Validators.compose([Validators.required]),
      ],
      fecha_hasta: [
        fechaActual,
        Validators.compose([Validators.required]),
      ],
      cuenta_banco: [
        null,
        Validators.compose([Validators.required]),
      ],
    }, {
      validator: this.fechaDesdeMenorQueFechaHasta(
        'fecha_desde',
        'fecha_hasta',
      ),
    });
  }

  enviarFormulario() {
    if (this.formularioConciliacion.valid) {
      if (this.detalle) {

        this.conciliacionService
          .actualizarDatos(this.detalle, this.formularioConciliacion.value)
          .subscribe((respuesta) => {
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.activatedRoute.queryParams.subscribe((parametro) => {
              this.router.navigate([`contabilidad/especial/conciliacion/detalle/${respuesta.id}`], {
                queryParams: {
                  ...parametro,
                },
              });
            });
          });
      } else {
        this.conciliacionService
          .guardarConciliacion(this.formularioConciliacion.value)
          .subscribe((respuesta) => {
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.activatedRoute.queryParams.subscribe((parametro) => {
              this.router.navigate([`contabilidad/especial/conciliacion/detalle/${respuesta.id}`], {
                queryParams: {
                  ...parametro,
                },
              });
            });
          });
      }
    } else {
      this.formularioConciliacion.markAllAsTouched();
    }
  }

  consultarDetalle() {
    this.conciliacionService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta) => {
        this.formularioConciliacion.patchValue({
          fecha_desde: respuesta.fecha_desde,
          fecha_hasta: respuesta.fecha_hasta,
          cuenta_banco: respuesta.cuenta_banco,
        });

        this.changeDetectorRef.detectChanges();
      });
  }

  navegarAtras() {
    this.router.navigate([`contabilidad/especial/conciliacion`]);
  }

  fechaDesdeMenorQueFechaHasta(
    fechaDesde: string,
    fechaHasta: string,
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
