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
import { BuscarContratoComponent } from '@comun/componentes/buscar-contrato/buscar-contrato.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarHumConcepto } from '@interfaces/comunes/autocompletar/autocompletar';
import { AdicionalService } from '@modulos/humano/servicios/adicional.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';

@Component({
  selector: 'app-adicional-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    TranslateModule,
    NgbDropdownModule,
    NgSelectModule,
    BuscarContratoComponent,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
  ],
  templateUrl: './adicional-formulario.component.html',
  styleUrl: './adicional-formulario.component.scss',
})
export default class AdicionalFormularioComponent
  extends General
  implements OnInit
{
  formularioAdicional: FormGroup;
  arrConceptos: any[] = [];
  arrConceptosAdicional: RegistroAutocompletarHumConcepto[] = [];
  arrContratos: any[] = [];

  private readonly _generalService = inject(GeneralService);

  constructor(
    private formBuilder: FormBuilder,
    private adicionalService: AdicionalService
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

  iniciarFormulario() {
    this.formularioAdicional = this.formBuilder.group({
      concepto: [null, Validators.compose([Validators.required])],
      contrato: ['', Validators.compose([Validators.required])],
      contrato_nombre: [''],
      contrato_numero_identificacion: [''],
      concepto_nombre: [''],
      arrConceptosAdicional: [''],
      detalle: [null],
      horas: [0],
      aplica_dia_laborado: [false],
      inactivo: [false],
      inactivo_periodo: [false],
      permanente: [true],
      valor: [
        0,
        Validators.compose([
          Validators.pattern(/^[0-9.]+$/),
          Validators.required,
        ]),
      ],
    });
  }

  // Método para manejar cambios en la selección
  seleccionarConceptoAdcional(item: any) {
    this.formularioAdicional.patchValue({
      concepto: item.value.concepto_id,
    });
    this.changeDetectorRef.detectChanges();
  }

  consultarInformacion() {
    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarHumConcepto>({
        filtros: [
          {
            propiedad: 'adicional',
            valor1: true,
          },
        ],
        modelo: 'HumConcepto',
        serializador: 'ListaAutocompletar',
      })
      .subscribe((respuesta: any) => {
        this.arrConceptosAdicional = respuesta.registros;
        this.changeDetectorRef.detectChanges();
      });
  }

  enviarFormulario() {
    if (this.formularioAdicional.valid) {
      if (this.detalle) {
        this.adicionalService
          .actualizarDatosAdicional(
            this.detalle,
            this.formularioAdicional.value
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
        this.adicionalService
          .guardarAdicional(this.formularioAdicional.value)
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
      this.formularioAdicional.markAllAsTouched();
    }
  }

  consultarDetalle() {
    this.adicionalService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioAdicional.patchValue({
          concepto: respuesta.concepto_id,
          concepto_nombre: respuesta.concepto_nombre,
          contrato: respuesta.contrato_id,
          contrato_nombre: respuesta.contrato_contacto_nombre_corto,
          contrato_numero_identificacion:
            respuesta.contrato_contacto_numero_identificacion,
          detalle: respuesta.detalle,
          horas: respuesta.horas,
          valor: respuesta.valor,
          aplica_dia_laborado: respuesta.aplica_dia_laborado,
          inactivo: respuesta.inactivo,
          inactivo_periodo: respuesta.inactivo_periodo,
        });
        this.changeDetectorRef.detectChanges();
      });
  }

  // consultarConceptos(event: any) {
  //   let arrFiltros = {
  //     // filtros: [
  //     //   {
  //     //     operador: '__icontains',
  //     //     propiedad: 'nombre__icontains',
  //     //     valor1: `${event?.target.value}`,
  //     //   },
  //     // ],
  //     // limite: 10,
  //     // desplazar: 0,
  //     // ordenamientos: [],
  //     // limite_conteo: 10000,
  //     modelo: 'HumConcepto',
  //     serializador: 'ListaAutocompletar',
  //   };

  //   this._generalService
  //     .consultarDatosAutoCompletar<RegistroAutocompletarConcepto>({
  //       modelo: 'HumConcepto',
  //       serializador: 'ListaAutocompletar',
  //     })
  //     .pipe(
  //       throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
  //       tap((respuesta) => {
  //         this.arrConceptos = respuesta.registros;
  //         this.changeDetectorRef.detectChanges();
  //       })
  //     )
  //     .subscribe();
  // }

  // consultarContratos(event: any) {
  //   let arrFiltros: ParametrosFiltros = {
  //     filtros: [
  //       {
  //         operador: '',
  //         propiedad: 'contacto__nombre_corto__icontains',
  //         valor1: `${event?.target.value}`,
  //         valor2: '',
  //       },
  //     ],
  //     limite: 10,
  //     desplazar: 0,
  //     ordenamientos: [],
  //     limite_conteo: 10000,
  //     modelo: 'HumContrato',
  //     serializador: 'ListaAutocompletar',
  //   };

  //   // this._generalService
  //   //   .consultarDatosAutoCompletar<RegistroAutocompletarHumContrato>(arrFiltros)
  //   //   .pipe(
  //   //     throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
  //   //     tap((respuesta) => {
  //   //       this.arrContratos = respuesta.registros;
  //   //       this.changeDetectorRef.detectChanges();
  //   //     })
  //   //   )
  //   //   .subscribe();
  // }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioAdicional?.markAsDirty();
    this.formularioAdicional?.markAsTouched();
    if (campo === 'concepto') {
      this.formularioAdicional.get(campo)?.setValue(dato.concepto_id);
      this.formularioAdicional
        .get('concepto_nombre')
        ?.setValue(dato.concepto_nombre);
    }
    if (campo === 'contrato') {
      this.formularioAdicional.get(campo)?.setValue(dato.contrato_id);
      this.formularioAdicional
        .get('contrato_nombre')
        ?.setValue(dato.contrato_contacto_nombre_corto);
      this.formularioAdicional
        .get('contrato_numero_identificacion')
        ?.setValue(dato.contrato_contacto_numero_identificacion);
    }
    if (campo === 'detalle') {
      if (this.formularioAdicional.get(campo)?.value === '') {
        this.formularioAdicional.get(campo)?.setValue(null);
      }
    }
    this.changeDetectorRef.detectChanges();
  }
}
