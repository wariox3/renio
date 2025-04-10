import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BuscarContratoComponent } from '@comun/componentes/buscar-contrato/buscar-contrato.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarHumConcepto } from '@interfaces/comunes/autocompletar/humano/hum-concepto.interface';
import { CreditoService } from '@modulos/humano/servicios/credito.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, Subject, takeUntil, tap, throttleTime } from 'rxjs';
import { TituloAccionComponent } from "../../../../../../comun/componentes/titulo-accion/titulo-accion.component";
import { RegistroAutocompletarHumContrato } from '@interfaces/comunes/autocompletar/humano/hum-contrato.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { Rutas } from '@interfaces/menu/configuracion.interface';

@Component({
  selector: 'app-credito-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    TranslateModule,
    NgbDropdownModule,
    BuscarContratoComponent,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent
  ],
  templateUrl: './credito-formulario.component.html',
  styleUrl: './credito-formulario.component.scss',
})
export default class CreditoFormularioComponent
  extends General
  implements OnInit, OnDestroy {
  formularioAdicional: FormGroup;
  arrContratos: RegistroAutocompletarHumContrato[] = [];
  arrConceptos: RegistroAutocompletarHumConcepto[] = [];

  private _generalService = inject(GeneralService);
  private readonly _configModuleService = inject(ConfigModuleService)
  private _destroy$ = new Subject<void>()
  private _rutas: Rutas | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private creditoService: CreditoService
  ) {
    super();
  }

  ngOnInit() {
    this.configurarModuloListener()
    this.iniciarFormulario();
    if (this.detalle) {
      this.consultarDetalle();
    }
  }

  private configurarModuloListener() {
    this._configModuleService.currentModelConfig$
      .pipe(takeUntil(this._destroy$))
      .subscribe((modeloConfig) => {
        this._rutas = modeloConfig?.ajustes.rutas;
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.unsubscribe();
  }

  iniciarFormulario() {
    const fechaActual = new Date(); // Obtener la fecha actual

    this.formularioAdicional = this.formBuilder.group({
      fecha_inicio: [fechaActual.toISOString().substring(0, 10), Validators.compose([Validators.required])],
      contrato: ['', Validators.compose([Validators.required])],
      contrato_nombre: [''],
      contrato_numero_identificacion: [''],
      total: ['', Validators.compose([Validators.required])],
      cuota: [0, Validators.compose([Validators.required])],
      cantidad_cuotas: ['', Validators.compose([Validators.required])],
      concepto: ['', Validators.compose([Validators.required])],
      concepto_nombre: [''],
      validar_cuotas: [false],
      inactivo: [false],
      aplica_prima: [false],
      aplica_cesantia: [false],
    });
  }

  enviarFormulario() {
    if (this.formularioAdicional.valid) {
      if (this.detalle) {
        this.creditoService
          .actualizarDatoCredito(this.detalle, this.formularioAdicional.value)
          .subscribe((respuesta) => {
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.activatedRoute.queryParams.subscribe((parametros) => {
              this.router.navigate([`${this._rutas?.detalle}/${respuesta.id}`], {
                queryParams: {
                  ...parametros,
                },
              });
            })
            this.changeDetectorRef.detectChanges();
          });
      } else {
        this.creditoService
          .guardarCredito(this.formularioAdicional.value)
          .pipe(
            tap((respuesta: any) => {
              this.alertaService.mensajaExitoso('Se guardó la información');
              this.activatedRoute.queryParams.subscribe((parametros) => {
                this.router.navigate([`${this._rutas?.detalle}/${respuesta.id}`], {
                  queryParams: {
                    ...parametros,
                  },
                });
              })
            })
          )
          .subscribe();
      }
    } else {
      this.formularioAdicional.markAllAsTouched();
    }
  }

  consultarDetalle() {
    this.creditoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta) => {
        this.formularioAdicional.patchValue({
          fecha_inicio: respuesta.fecha_inicio,
          contrato: respuesta.contrato_id,
          contrato_nombre: respuesta.contrato_contacto_nombre_corto,
          contrato_numero_identificacion: respuesta.contrato_contacto_numero_identificacion,
          total: respuesta.total,
          cuota: respuesta.cuota,
          cantidad_cuotas: respuesta.cantidad_cuotas,
          validar_cuotas: respuesta.validar_cuotas,
          inactivo: respuesta.inactivo,
          concepto: respuesta.concepto_id,
          concepto_nombre: respuesta.concepto_nombre,
          aplica_prima: respuesta.aplica_prima,
          aplica_cesantia: respuesta.aplica_cesantia,
        });
        this.changeDetectorRef.detectChanges();
      });
  }

  consultarContratos(event: any) {
    let arrFiltros: ParametrosFiltros = {
      filtros: [
        {
          propiedad: 'contacto__nombre_corto__icontains',
          valor1: `${event?.target.value}`,
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'HumContrato',
      serializador: "ListaAutocompletar"
    };

    this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarHumContrato>(
      arrFiltros
    )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrContratos = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  consultarConceptos(event: any) {
    let arrFiltros: ParametrosFiltros = {
      filtros: [
        {
          propiedad: 'nombre__icontains',
          valor1: `${event?.target.value}`,
        },
        {
          propiedad: 'concepto_tipo',
          valor1: '8',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'HumConcepto',
      serializador: "ListaAutocompletar"
    };

    this._generalService.
      consultarDatosAutoCompletar<RegistroAutocompletarHumConcepto>(
        arrFiltros
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrConceptos = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioAdicional?.markAsDirty();
    this.formularioAdicional?.markAsTouched();
    if (campo === 'contrato') {
      this.formularioAdicional.get(campo)?.setValue(dato.contrato_id);
      this.formularioAdicional
        .get('contrato_nombre')
        ?.setValue(dato.contrato_contacto_nombre_corto);

      this.formularioAdicional
        .get('contrato_numero_identificacion')
        ?.setValue(dato.contrato_contacto_numero_identificacion);

    }
    if (campo === 'concepto') {
      this.formularioAdicional.get(campo)?.setValue(dato.concepto_id);
      this.formularioAdicional
        .get('concepto_nombre')
        ?.setValue(dato.concepto_nombre);
    }
    this.changeDetectorRef.detectChanges();
  }
}
