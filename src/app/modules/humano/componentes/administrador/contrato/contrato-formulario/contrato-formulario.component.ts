import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { BuscarAvanzadoComponent } from '@comun/componentes/buscar-avanzado/buscar-avanzado.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { HttpService } from '@comun/services/http.service';
import { ContratoService } from '@modulos/humano/servicios/contrato.service';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, tap, throttleTime, zip } from 'rxjs';

@Component({
  selector: 'app-contrato-formulario',
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
  templateUrl: './contrato-formulario.component.html',
  styleUrls: ['./contrato-formulario.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContratoFormularioComponent
  extends General
  implements OnInit
{
  formularioContrato: FormGroup;
  arrEmpleados: any[] = [];
  arrGrupo: any[] = [];
  arrContratoTipo: any[] = [];
  camposBuscarAvanzado = [
    'id',
    'identificacion_abreviatura',
    'numero_identificacion',
    'nombre_corto',
  ];

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private contratoService: ContratoService
  ) {
    super();
  }

  ngOnInit() {
    this.consultarInformacion();
    this.iniciarFormulario();
    if (this.detalle) {
      this.consultardetalle();
    }
  }

  iniciarFormulario() {
    const fechaActual = new Date(); // Obtener la fecha actual
    const fechaVencimientoInicial = `${fechaActual.getFullYear()}-${(
      fechaActual.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}`;
    this.formularioContrato = this.formBuilder.group({
      contacto: ['', Validators.compose([Validators.required])],
      contacto_nombre: [''],
      fecha_desde: [
        fechaVencimientoInicial,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          Validators.pattern(/^[a-z-0-9.-_]*$/),
        ]),
      ],
      fecha_hasta: [
        fechaVencimientoInicial,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          Validators.pattern(/^[a-z-0-9.-_]*$/),
        ]),
      ],
      grupo: ['', Validators.compose([Validators.required])],
      contrato_tipo: ['', Validators.compose([Validators.required])],
    });
  }

  enviarFormulario() {
    if (this.formularioContrato.valid) {
      if (this.detalle) {
        this.contratoService
          .actualizarDatosContacto(this.detalle, this.formularioContrato.value)
          .subscribe((respuesta) => {
            this.formularioContrato.patchValue({
              empleado: respuesta.contacto_id,
              empleadoNombre: respuesta.contado_nombre_corto,
              fecha_desde: respuesta.fecha_desde,
              fecha_hasta: respuesta.fecha_hasta,
            });
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.router.navigate(['/administrador/detalle'], {
              queryParams: {
                modulo: this.activatedRoute.snapshot.queryParams['modulo'],
                modelo: this.activatedRoute.snapshot.queryParams['modelo'],
                tipo: this.activatedRoute.snapshot.queryParams['tipo'],
                detalle: respuesta.id,
              },
            });
            this.changeDetectorRef.detectChanges();
          });
      } else {
        this.contratoService
          .guardarContrato(this.formularioContrato.value)
          .pipe(
            tap((respuesta: any) => {
              this.alertaService.mensajaExitoso('Se guardó la información');
              this.router.navigate(['/administrador/detalle'], {
                queryParams: {
                  modulo: this.activatedRoute.snapshot.queryParams['modulo'],
                  modelo: this.activatedRoute.snapshot.queryParams['modelo'],
                  tipo: this.activatedRoute.snapshot.queryParams['tipo'],
                  detalle: respuesta.id,
                  accion: 'detalle',
                },
              });
            })
          )
          .subscribe();
      }
    } else {
      this.formularioContrato.markAllAsTouched();
    }
  }

  consultarInformacion() {
    zip(
      this.httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/autocompletar/',
        {
          filtros: [
            {
              operador: '__icontains',
              propiedad: 'nombre__icontains',
              valor1: '',
              valor2: '',
            },
          ],
          limite: 10,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'HumGrupo',
        }
      ),
      this.httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/autocompletar/',
        {
          filtros: [
            {
              operador: '__icontains',
              propiedad: 'nombre__icontains',
              valor1: '',
              valor2: '',
            },
          ],
          limite: 10,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'HumContratoTipo',
        }
      )
    ).subscribe((respuesta: any) => {
      this.arrGrupo = respuesta[0].registros;
      this.arrContratoTipo = respuesta[1].registros;
      this.changeDetectorRef.detectChanges();
    });
  }

  consultarEmpleado(event: any) {
    let arrFiltros = {
      filtros: [
        {
          operador: '__icontains',
          propiedad: 'nombre_corto__icontains',
          valor1: `${event?.target.value}`,
          valor2: '',
        },
        {
          operador: '',
          propiedad: 'empleado',
          valor1: true,
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'GenContacto',
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/autocompletar/',
        arrFiltros
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrEmpleados = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  actualizarFormulario(dato: any, campo: string) {
    if (campo === 'contacto') {
      this.formularioContrato.get(campo)?.setValue(dato.id);
      this.formularioContrato
        .get('contacto_nombre')
        ?.setValue(dato.nombre_corto);
    }
    this.formularioContrato?.markAsDirty();
    this.formularioContrato?.markAsTouched();
    this.changeDetectorRef.detectChanges();
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioContrato?.markAsDirty();
    this.formularioContrato?.markAsTouched();
    if (campo === 'contacto') {
      this.formularioContrato.get(campo)?.setValue(dato.contacto_id);
      this.formularioContrato
        .get('contacto_nombre')
        ?.setValue(dato.contacto_nombre_corto);
    }
    this.changeDetectorRef.detectChanges();
  }

  consultardetalle() {
    this.contratoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioContrato.patchValue({
          contacto: respuesta.contacto_id,
          contacto_nombre: respuesta.contacto_nombre_corto,
          fecha_desde: respuesta.fecha_desde,
          fecha_hasta: respuesta.fecha_hasta,
          grupo: respuesta.grupo_id,
          contrato_tipo: respuesta.contrato_tipo_id,
        });

        this.changeDetectorRef.detectChanges();
      });
  }
}
