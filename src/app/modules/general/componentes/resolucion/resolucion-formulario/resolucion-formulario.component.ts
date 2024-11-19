import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ResolucionService } from '@modulos/general/servicios/resolucion.service';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezadoFormularioNuevo/encabezadoFormularioNuevo.component';

@Component({
  selector: 'app-resolucion-nuevo',
  standalone: true,
  templateUrl: './resolucion-formulario.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    NgbModalModule,
    EncabezadoFormularioNuevoComponent,
  ],
  providers: [NgbActiveModal],
})
export default class ResolucionFormularioComponent
  extends General
  implements OnInit
{
  formularioResolucion: FormGroup;
  @Input() ocultarBtnAtras: Boolean = false;
  @Input() tipoRolucion: 'compra' | 'venta' | null = null;
  @Input() tituloFijo: Boolean = false;
  @Input() editarInformacion: Boolean = false;
  @Input() idEditarInformacion: number | null = null;
  @Output() emitirGuardoRegistro: EventEmitter<any> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private resolucionService: ResolucionService
  ) {
    super();
  }

  ngOnInit() {
    this.iniciarFormulario();
    if (this.detalle || this.editarInformacion) {
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

    this.formularioResolucion = this.formBuilder.group({
      prefijo: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(10)]),
      ],
      numero: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
        ]),
      ],
      consecutivo_desde: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]*$/),
        ]),
      ],
      consecutivo_hasta: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]*$/),
        ]),
      ],
      fecha_desde: [
        fechaVencimientoInicial,
        Validators.compose([Validators.required]),
      ],
      fecha_hasta: [
        fechaVencimientoInicial,
        Validators.compose([Validators.required]),
      ],
    });
  }

  get obtenerFormularioCampos() {
    return this.formularioResolucion.controls;
  }

  enviarFormulario() {
    if (this.formularioResolucion.valid) {
      let tipoResolucion: any = {};
      tipoResolucion[this.parametrosUrl.resoluciontipo] = true;

      if (this.tipoRolucion != null) {
        tipoResolucion[this.tipoRolucion] = true;
      }

      if (this.detalle || this.idEditarInformacion) {
        let resolucionId = this.detalle;

        if (this.idEditarInformacion !== null) {
          resolucionId = this.idEditarInformacion;
        }

        this.resolucionService
          .actualizarDatos(resolucionId, {
            ...this.formularioResolucion.value,
            ...tipoResolucion,
          })
          .subscribe((respuesta: any) => {
            this.formularioResolucion.patchValue({
              prefijo: respuesta.prefijo,
              numero: respuesta.numero,
              consecutivo_desde: respuesta.consecutivo_desde,
              consecutivo_hasta: respuesta.consecutivo_hasta,
              fecha_desde: respuesta.fecha_desde,
              fecha_hasta: respuesta.fecha_hasta,
            });
            this.alertaService.mensajaExitoso('Se actualizó la información');
            if (this.ocultarBtnAtras) {
              this.emitirGuardoRegistro.emit(respuesta); // necesario para cerrar el modal que está en editarEmpresa
            } else {
              this.activatedRoute.queryParams.subscribe((parametro) => {
                this.router.navigate([`/administrador/detalle`], {
                  queryParams: {
                    ...parametro,
                    detalle: respuesta.id,
                  },
                });
              });
            }
          });
      } else {
        this.resolucionService
          .guardarResolucion({
            ...this.formularioResolucion.value,
            ...tipoResolucion,
          })
          .subscribe((respuesta: any) => {
            this.alertaService.mensajaExitoso('Se actualizó la información');
            if (this.ocultarBtnAtras) {
              this.emitirGuardoRegistro.emit(respuesta); // necesario para cerrar el modal que está en editarEmpresa
            } else {
              this.activatedRoute.queryParams.subscribe((parametro) => {
                this.router.navigate([`/administrador/detalle`], {
                  queryParams: {
                    ...parametro,
                    detalle: respuesta.id,
                  },
                });
              });
            }
          });
      }
    } else {
      this.formularioResolucion.markAllAsTouched();
    }
  }

  consultardetalle() {
    let resolucionId = this.detalle;

    if (this.idEditarInformacion !== null) {
      resolucionId = this.idEditarInformacion;
    }

    this.resolucionService
      .consultarDetalle(resolucionId)
      .subscribe((respuesta: any) => {
        this.formularioResolucion.patchValue({
          prefijo: respuesta.prefijo,
          numero: respuesta.numero,
          consecutivo_desde: respuesta.consecutivo_desde,
          consecutivo_hasta: respuesta.consecutivo_hasta,
          fecha_desde: respuesta.fecha_desde,
          fecha_hasta: respuesta.fecha_hasta,
        });
        this.changeDetectorRef.detectChanges();
      });
  }
}
