import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertaService } from '@comun/services/alerta.service';
import { GeneralService } from '@comun/services/general.service';
import { AplicacionAccion } from '@comun/type/aplicaciones-acciones.type';
import { validarPrecio } from '@comun/validaciones/validar-precio.validator';
import { RegistroAutocompletarHumConceptoAdicional } from '@interfaces/comunes/autocompletar/humano/hum-concepto-adicional.interface';
import { LiquidacionAdicionalService } from '@modulos/humano/servicios/liquidacion-adicional.service';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { ParametrosApi } from 'src/app/core/interfaces/api.interface';

@Component({
  selector: 'app-modal-liquidacion-adicional',
  standalone: true,
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    CommonModule,
    NgSelectModule,
  ],
  templateUrl: './modal-liquidacion-adicional.component.html',
})
export class ModalLiquidacionAdicionalComponent {
  accion = signal<Extract<AplicacionAccion, 'nuevo' | 'editar'>>('nuevo');

  formularioAdicionalLiquidacion: FormGroup;
  arrConceptosAdicional = signal<RegistroAutocompletarHumConceptoAdicional[]>(
    [],
  );
  registroAdicionalSeleccionado = signal(0);
  arrParametrosConsultaAdicionalEditar: ParametrosApi = {};

  private _modalService = inject(NgbModal);
  private _generalService = inject(GeneralService);
  private _formBuilder = inject(FormBuilder);
  private _liquidacionAdicionalService = inject(LiquidacionAdicionalService);

  @Input() liquidacionId: number;
  @Output() emitirConsultarLista: EventEmitter<any> = new EventEmitter();

  @ViewChild('contentModalAdicional') contentModalAdicional: TemplateRef<any>;

  abrirModalNuevo(operacion: '1' | '-1') {
    this._consultarConceptosAdicionales(operacion)
    this.iniciarFormulario();
    this._iniciarSuscripcionesFormularioAdicionalLiquidacion(operacion);

    this._modalService.open(this.contentModalAdicional, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
  }

  abrirModalEditar(id: number, operacion: '1' | '-1') {
    this.accion.set('editar')
    this._modalService.open(this.contentModalAdicional, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.registroAdicionalSeleccionado.set(id);
    this._consultarConceptosAdicionales(operacion);
    this.iniciarFormulario();
    this.inicializarParametrosConsultaAdicionalDetalle(id);
    this.consultarRegistroDetalleAdicional(id);
    this._iniciarSuscripcionesFormularioAdicionalLiquidacion(operacion);
  }

  iniciarFormulario() {
    this.formularioAdicionalLiquidacion = this._formBuilder.group({
      concepto: [null, Validators.compose([Validators.required])],
      concepto_nombre: [''],
      valor: [
        0,
        Validators.compose([
          validarPrecio(),
          Validators.required,
          Validators.pattern(/^[0-9.]+$/),
        ]),
      ],
      deduccion: [0],
      adicional: [0],
      liquidacion: [this.liquidacionId],
    });
  }

  guardar() {
    if (!this.formularioAdicionalLiquidacion.valid) {
      this.formularioAdicionalLiquidacion.markAllAsTouched();
      return;
    }
    if (this.accion() === 'nuevo') {
      this._nuevoAdicional();
    } else {
      this._editarAdicional();
    }
  }

  cerrarModal() {
    this._modalService.dismissAll();
  }

  private _nuevoAdicional() {
    this._liquidacionAdicionalService.nuevo(this.formularioAdicionalLiquidacion.value).subscribe(() => {
      this.cerrarModal()
      this.emitirConsultarLista.emit();
    })
  }

  private _editarAdicional() {
    this._liquidacionAdicionalService.actualizarDatoAdicional(this.registroAdicionalSeleccionado(), this.formularioAdicionalLiquidacion.value).subscribe(() => {
      this.cerrarModal()
      this.emitirConsultarLista.emit();
    })
  }


  inicializarParametrosConsultaAdicionalDetalle(id: number) {
    this.arrParametrosConsultaAdicionalEditar = {
      id,
    };
  }

  consultarRegistroDetalleAdicional(id: number) {
    this._liquidacionAdicionalService.getLiquidacionPorId(id)
      .subscribe((respuesta) => {
        this.formularioAdicionalLiquidacion.patchValue({
          concepto: respuesta.concepto,
          concepto_nombre: respuesta.concepto__nombre,
          valor: respuesta.adicional > 0 ? respuesta.adicional : respuesta.deduccion,
          deduccion: respuesta.deduccion,
          adicional: respuesta.adicional,
        });
      });
  }

  private _consultarConceptosAdicionales(operacion: '1' | '-1') {
    this._generalService
      .consultaApi<RegistroAutocompletarHumConceptoAdicional[]>(
        'humano/concepto/seleccionar/',
        {
          adicional: 'True',
          operacion,
        },
      )
      .subscribe((respuesta) => {
        this.arrConceptosAdicional.set(respuesta);
      });
  }

  private _iniciarSuscripcionesFormularioAdicionalLiquidacion(operacion: '1' | '-1') {
    const mapOperacion = {
      '1': 'adicional',
      '-1': 'deduccion',
    };
    const destino = mapOperacion[operacion];
    this.formularioAdicionalLiquidacion.get('valor')?.valueChanges.subscribe((nuevoValor: number) => {
      if (operacion) {
        this.formularioAdicionalLiquidacion.patchValue(
          { adicional: 0, deduccion: 0, [destino]: nuevoValor },
          { emitEvent: false }
        );
      }
    });
  }


}
