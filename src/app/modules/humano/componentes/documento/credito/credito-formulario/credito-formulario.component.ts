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
import { HttpService } from '@comun/services/http.service';
import { AutocompletarRegistros, RegistroAutocompletarHumContrato } from '@interfaces/comunes/autocompletar';
import { CreditoService } from '@modulos/humano/servicios/creditoservice';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, tap, throttleTime } from 'rxjs';

@Component({
  selector: 'app-credito-formulario',
  standalone: true,
  imports: [
    CommonModule,
    BtnAtrasComponent,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    TranslateModule,
    NgbDropdownModule,
  ],
  templateUrl: './credito-formulario.component.html',
  styleUrl: './credito-formulario.component.scss',
})
export default class CreditoFormularioComponent
  extends General
  implements OnInit
{
  formularioAdicional: FormGroup;
  arrContratos: any[] = [];
  arrConceptos: any;
  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private creditoService: CreditoService
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
    const fechaActual = new Date(); // Obtener la fecha actual

    this.formularioAdicional = this.formBuilder.group({
      fecha_inicio: [fechaActual.toISOString().substring(0, 10), Validators.compose([Validators.required])],
      contrato: ['', Validators.compose([Validators.required])],
      contrato_nombre: [''],
      total: ['', Validators.compose([Validators.required])],
      cuota: [0, Validators.compose([Validators.required])],
      cantidad_cuotas: ['', Validators.compose([Validators.required])],
      concepto: ['', Validators.compose([Validators.required])],
      concepto_nombre: [''],
      validar_cuotas: [false],
      inactivo: [false],
      inactivo_periodo: [false],
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
              this.router.navigate(['documento/detalle'], {
                queryParams: {
                  ...parametros,
                  detalle: respuesta.id,
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
                this.router.navigate(['documento/detalle'], {
                  queryParams: {
                    ...parametros,
                    detalle: respuesta.id,
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
      .subscribe((respuesta: any) => {
        this.formularioAdicional.patchValue({
          fecha_inicio: respuesta.fecha_inicio,
          contrato: respuesta.contrato_id,
          contrato_nombre: respuesta.contrato_contacto_nombre_corto,
          total: respuesta.total,
          cuota: respuesta.cuota,
          cantidad_cuotas: respuesta.cantidad_cuotas,
          validar_cuotas: respuesta.validar_cuotas,
          inactivo: respuesta.inactivo,
          inactivo_periodo: respuesta.inactivo_periodo,
          concepto: respuesta.concepto_id,
          concepto_nombre: respuesta.concepto_nombre
        });
        this.changeDetectorRef.detectChanges();
      });
  }

  consultarContratos(event: any) {
    let arrFiltros = {
      filtros: [
        {
          operador: '__icontains',
          propiedad: 'contacto__nombre_corto__icontains',
          valor1: `${event?.target.value}`,
          valor2: '',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'HumContrato',
      serializador: "ListaAutocompletar"
    };

    this.httpService
      .post<AutocompletarRegistros<RegistroAutocompletarHumContrato>>(
        'general/funcionalidad/lista/',
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
    let arrFiltros = {
      filtros: [
        {
          operador: '__icontains',
          propiedad: 'nombre__icontains',
          valor1: `${event?.target.value}`,
          valor2: '',
        },
        {
          operador: '',
          propiedad: 'concepto_tipo',
          valor1: '8',
          valor2: '',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'HumConcepto',
      serializador: "ListaAutocompletar"
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista/',
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
