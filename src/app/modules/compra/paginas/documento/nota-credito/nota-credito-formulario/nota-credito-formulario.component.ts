import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BuscarAvanzadoComponent } from '@comun/componentes/buscar-avanzado/buscar-avanzado.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { FormularioProductosComponent } from '@comun/componentes/factura/components/formulario-productos/formulario-productos.component';
import { TituloAccionComponent } from '@comun/componentes/titulo-accion/titulo-accion.component';
import { AnimacionFadeInOutDirective } from '@comun/directive/animacion-fade-in-out.directive';
import { FormularioFacturaService } from '@comun/services/factura/formulario-factura.service';
import { GeneralService } from '@comun/services/general.service';
import { HttpService } from '@comun/services/http.service';
import { CampoLista } from '@interfaces/comunes/componentes/buscar-avanzado/buscar-avanzado.interface';
import {
  AcumuladorImpuestos,
  DocumentoFacturaRespuesta,
} from '@interfaces/comunes/factura/factura.interface';
import { Contacto } from '@interfaces/general/contacto';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import {
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, tap, throttleTime, zip } from 'rxjs';
import ContactoFormulario from '../../../../../general/paginas/contacto/contacto-formulario/contacto-formulario.component';
import { RegistroAutocompletarGenMetodoPago } from '@interfaces/comunes/autocompletar/general/gen-metodo-pago.interface';
import { RegistroAutocompletarGenDocumentoReferencia } from '@interfaces/comunes/autocompletar/general/gen-documento.interface';
import { RegistroAutocompletarGenPlazoPago } from '@interfaces/comunes/autocompletar/general/gen-plazo-pago.interface';
import { RegistroAutocompletarGenContacto } from '@interfaces/comunes/autocompletar/general/gen-contacto.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { FacturaCuentaComponent } from '../../factura/factura-cuenta/factura-cuenta.component';
import { SeleccionarGrupoComponent } from '../../../../../../comun/componentes/factura/components/seleccionar-grupo/seleccionar-grupo.component';

@Component({
  selector: 'app-nota-credito-formulario',
  standalone: true,
  templateUrl: './nota-credito-formulario.component.html',
  styleUrls: ['./nota-credito-formulario.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbDropdownModule,
    NgbNavModule,
    BuscarAvanzadoComponent,
    CardComponent,
    AnimacionFadeInOutDirective,
    ContactoFormulario,
    FormularioProductosComponent,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
    SeleccionarGrupoComponent,
    FacturaCuentaComponent,
  ],
})
export default class FacturaDetalleComponent
  extends General
  implements OnInit, OnDestroy
{
  private _formularioFacturaService = inject(FormularioFacturaService);
  private readonly _generalService = inject(GeneralService);

  public modoEdicion = this._formularioFacturaService.modoEdicion;
  public acumuladorImpuesto =
    this._formularioFacturaService.acumuladorImpuestos;
  public estadoAprobado = this._formularioFacturaService.estadoAprobado;
  public mostrarDocumentoReferencia =
    this._formularioFacturaService.mostrarDocumentoReferencia;
  public acumuladorDebitosCreditos =
    this._formularioFacturaService.acumuladorDebitosCreditos;
  public filtrosPermanentesNotaCredito = {};
  public formularioFactura = this._formularioFacturaService.form;

  informacionFormulario: any;
  active: Number;
  totalCantidad: number = 0;
  totalDescuento: number = 0;
  totalImpuestos: number = 0;
  totalGeneral: number = 0;
  subtotalGeneral: number = 0;
  totalNetoGeneral: number = 0;
  totalBase: number = 0;
  informacionDetalle: any = {
    contacto_id: '',
    descuento: '',
    documento_tipo_id: '',
    fecha: '',
    fecha_vence: '',
    id: null,
    impuesto: 0,
    numero: null,
    subtotal: 0,
    total: 0,
    total_bruto: 0,
    metodo_pago: null,
    detalles: [],
  };
  acumuladorImpuestos: any[] = [];
  arrMovimientosClientes: RegistroAutocompletarGenContacto[] = [];
  referencias: RegistroAutocompletarGenDocumentoReferencia[] = [];
  arrMetodosPago: any[] = [];
  arrPlazoPago: any[] = [];
  arrDetallesEliminado: number[] = [];
  arrImpuestosEliminado: number[] = [];
  dataUrl: any;
  plazo_pago_dias: any = 0;
  visualizarCampoDocumentoReferencia = false;
  @ViewChild('btnGuardar', { static: true }) btnGuardar: HTMLButtonElement;
  theme_value = localStorage.getItem('kt_theme_mode_value');

  public campoListaDocReferencia: CampoLista[] = [
    {
      propiedad: 'id',
      titulo: 'id',
      campoTipo: 'IntegerField',
    },
    {
      propiedad: 'documento_tipo_nombre',
      titulo: 'documento_tipo',
      campoTipo: 'CharField',
    },
    {
      propiedad: 'numero',
      titulo: 'numero',
      campoTipo: 'IntegerField',
    },
    {
      propiedad: 'fecha',
      titulo: 'fecha',
      campoTipo: 'CharField',
    },
    {
      propiedad: 'contacto_numero_identificacion',
      titulo: 'contacto_numero_identificacion',
      campoTipo: 'IntegerField',
    },
    {
      propiedad: 'contacto_nombre_corto',
      titulo: 'contacto_nombre_corto',
      campoTipo: 'CharField',
    },
    {
      propiedad: 'total',
      titulo: 'total',
      campoTipo: 'IntegerField',
      aplicaFormatoNumerico: true,
    },
  ];
  public campoListaContacto: CampoLista[] = [
    {
      propiedad: 'id',
      titulo: 'id',
      campoTipo: 'IntegerField',
    },
    {
      propiedad: 'numero_identificacion',
      titulo: 'identificacion',
      campoTipo: 'IntegerField',
    },
    {
      propiedad: 'nombre_corto',
      titulo: 'nombre_corto',
      campoTipo: 'IntegerField',
    },
  ];
  public filtrosPermanentes = [
    {
      propiedad: 'proveedor',
      valor1: 'True',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private facturaService: FacturaService,
    private modalService: NgbModal,
  ) {
    super();
  }

  ngOnInit() {
    this.consultarInformacion();
    this.mostrarDocumentoReferencia.set(true);
    this.active = 1;
    if (this.parametrosUrl) {
      this.dataUrl = this.parametrosUrl;
    }
    if (this.detalle) {
      this.modoEdicion.set(true);
    } else {
      this.modoEdicion.set(false);
    }

    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this._formularioFacturaService.reiniciarFormulario();
  }

  consultarInformacion() {
    zip(
      this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarGenMetodoPago>(
        {
          modelo: 'GenMetodoPago',
          serializador: 'ListaAutocompletar',
        },
      ),
      this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarGenPlazoPago>(
        {
          modelo: 'GenPlazoPago',
          serializador: 'ListaAutocompletar',
        },
      ),
    ).subscribe((respuesta: any) => {
      this.arrMetodosPago = respuesta[0].registros;
      this.arrPlazoPago = respuesta[1].registros;
      this.changeDetectorRef.detectChanges();
    });
  }

  get detalles() {
    return this.formularioFactura.get('detalles') as FormArray;
  }

  private _guardarFactura() {
    if (this.validarCamposDetalles() === false) {
      this.facturaService
        .guardarFactura({
          ...this.formularioFactura.value,
          ...{
            numero: null,
            documento_tipo: 6,
          },
        })
        .pipe(
          tap((respuesta) => {
            this.router.navigate(
              [`compra/documento/detalle/${respuesta.documento.id}`],
              {
                queryParams: {
                  ...this.parametrosUrl,
                },
              },
            );
          }),
        )
        .subscribe();
    }
  }

  private _actualizarFactura() {
    if (this.validarCamposDetalles() === false) {
      this._formularioFacturaService.submitActualizarFactura(
        'compra',
        this.detalle,
        this.parametrosUrl,
      );
    }
  }

  formSubmit() {
    if (this.formularioFactura.valid) {
      if (this.detalle !== 0) {
        this._actualizarFactura();
      } else {
        this._guardarFactura();
      }
    } else {
      this.formularioFactura.markAllAsTouched();
      this.validarCamposDetalles();
    }
  }

  validarCamposDetalles() {
    let errores = false;
    Object.values(this.detalles.controls).find((control: any) => {
      let tipo_registro = control.get('tipo_registro').value;

      if (tipo_registro === 'I') {
        if (control.get('item').value === null) {
          control.markAsTouched(); // Marcar el control como 'touched'
          control.markAsDirty();
          errores = true;
          this.detalles.markAllAsTouched();
          this.detalles.markAsDirty();
          this.changeDetectorRef.detectChanges();
          this.alertaService.mensajeError(
            'Error en formulario',
            'El campo item no puede estar vacío',
          );
        }
      } else if (tipo_registro === 'C') {
        if (control.get('cuenta').value === null) {
          control.markAsTouched(); // Marcar el control como 'touched'
          control.markAsDirty();
          errores = true;
          this.detalles.markAllAsTouched();
          this.detalles.markAsDirty();
          this.changeDetectorRef.detectChanges();
          this.alertaService.mensajeError(
            'Error en formulario',
            'El campo cuenta no puede estar vacío',
          );
        }
      }
    });
    this.changeDetectorRef.detectChanges();
    return errores;
  }

  agregarProductos() {
    const detalleFormGroup = this.formBuilder.group({
      item: [null, Validators.compose([Validators.required])],
      item_nombre: [null],
      cantidad: [0],
      precio: [0],
      porcentaje_descuento: [0],
      descuento: [0],
      subtotal: [0],
      total_bruto: [0],
      total: [0],
      neto: [0],
      base_impuesto: [0],
      impuesto: [0],
      impuestos: this.formBuilder.array([]),
      impuestos_eliminados: this.formBuilder.array([]),
      id: [null],
      seleccionado: [false],
    });
    this.formularioFactura?.markAsDirty();
    this.formularioFactura?.markAsTouched();

    this.detalles.push(detalleFormGroup);
    this.changeDetectorRef.detectChanges();
  }

  onImpuestoBlur(index: number, estado_aprobado: boolean) {
    if (!estado_aprobado) {
      if (this.detalles.controls[index].get('item')?.value) {
        if (index === this.detalles.length - 1) {
          this.agregarProductos();
        }
      }
    }
  }

  actualizarFormulario(dato: any, campo: string) {
    if (campo === 'contacto') {
      this._inicializarFormulario(dato.id);
      this._limpiarDocumentoReferencia(dato.id);
      this.formularioFactura.get(campo)?.setValue(dato.id);
      this.formularioFactura.get('contactoNombre')?.setValue(dato.nombre_corto);
    }
    if (campo === 'documento_referencia') {
      this.formularioFactura.get(campo)?.setValue(dato.id);
      this.formularioFactura
        .get('documento_referencia_numero')
        ?.setValue(dato.numero);
    }

    this.formularioFactura?.markAsDirty();
    this.formularioFactura?.markAsTouched();
    this.changeDetectorRef.detectChanges();
  }

  agregarItemSeleccionado(item: any, index: number) {
    this.detalles.controls[index].patchValue({
      precio: item.precio,
      item: item.id,
      cantidad: 1,
      subtotal: item.precio * 1,
      item_nombre: item.nombre,
      total: item.precio * 1,
    });

    if (item.impuestos) {
      item.impuestos.map((impuesto: any) => {
        impuesto['item_impuesto_id'] = null;
        impuesto['nombre'] = impuesto['impuesto_nombre'];
        impuesto['compra'] = impuesto['impuesto_compra'];
        impuesto['venta'] = impuesto['impuesto_venta'];
        impuesto['porcentaje'] = impuesto['impuesto_porcentaje'];
        impuesto['impuesto_porcentaje_base'] =
          impuesto['impuesto_porcentaje_base'];
        impuesto['id'] = null;
        impuesto['impuesto_venta'] = impuesto['impuesto_venta'];
        impuesto['impuesto_compra'] = impuesto['impuesto_compra'];
        this.agregarImpuesto(impuesto, index, 'agregar');
      });
    }
    this.calcularTotales();
    this.formularioFactura.markAsTouched();
    this.formularioFactura.markAsDirty();
    this.changeDetectorRef.detectChanges();
  }

  calcularTotales() {
    this.totalCantidad = 0;
    this.totalDescuento = 0;
    this.totalImpuestos = 0;
    this.totalGeneral = 0;
    this.subtotalGeneral = 0;
    this.totalNetoGeneral = 0;

    const detallesArray = this.formularioFactura.get('detalles') as FormArray;
    detallesArray.controls.forEach((detalleControl) => {
      const cantidad = detalleControl.get('cantidad')?.value || 0;

      const precio = detalleControl.get('precio')?.value || 0;
      const porcentajeDescuento = detalleControl.get('descuento')?.value || 0;
      let subtotal = cantidad * precio;
      let descuento = (porcentajeDescuento * subtotal) / 100;
      let subtotalFinal = subtotal - descuento;

      const impuestos = detalleControl.get('impuestos')?.value || [];
      impuestos.forEach((impuesto: any) => {
        this.totalImpuestos += impuesto.total;
      });

      let neto = detalleControl.get('neto')?.value || 0;

      this.totalCantidad += parseInt(cantidad);
      this.totalDescuento += descuento;
      this.subtotalGeneral += subtotalFinal;
      this.totalNetoGeneral += neto;

      detalleControl.get('subtotal')?.patchValue(subtotalFinal);
      detalleControl.get('neto')?.patchValue(neto);
      this.changeDetectorRef.detectChanges();
    });

    this.totalGeneral = this.subtotalGeneral + this.totalImpuestos;
    this.formularioFactura.patchValue({
      total: this.totalGeneral,
      subtotal: this.subtotalGeneral,
    });
  }

  eliminarProducto(index: number, id: number | null) {
    this.formularioFactura?.markAsDirty();
    this.formularioFactura?.markAsTouched();
    const detalleFormGroup = this.detalles.at(index) as FormGroup;

    if (id != null) {
      this.arrDetallesEliminado.push(id);
    }

    if (detalleFormGroup.value.impuestos.length > 0) {
      // Itera sobre cada impuesto que se desea eliminar del detalle del formulario.
      for (const impuestoEliminar of detalleFormGroup.value.impuestos) {
        // Verifica que impuestosEliminar no sea undefined y tenga la propiedad total.
        if (impuestoEliminar && impuestoEliminar.hasOwnProperty('total')) {
          const { total, nombre_extendido } = impuestoEliminar;
          // Busca el impuesto correspondiente en el acumuladorImpuestos por nombre_extendido.
          if (this.acumuladorImpuestos[nombre_extendido]?.total != null) {
            // Resta el total del impuesto eliminado del acumuladorImpuestos.
            this.acumuladorImpuestos[nombre_extendido].total -= total;
            // Si el total del impuesto acumulado es menor o igual a 0 después de la resta, elimínalo del acumulador.
            if (this.acumuladorImpuestos[nombre_extendido].total <= 0) {
              delete this.acumuladorImpuestos[nombre_extendido];
            }
          }
        }
      }
    }

    this.changeDetectorRef.detectChanges();
    this.detalles.removeAt(index);
    this.calcularTotales();
  }

  actualizarDetalle(index: number, campo: string, evento: any) {
    const detalleFormGroup = this.detalles.at(index) as FormGroup;

    if (evento.target.value !== '') {
      if (parseFloat(evento.target.value) < 0) {
        detalleFormGroup.get(campo)?.patchValue(0);
      } else {
        detalleFormGroup.get(campo)?.patchValue(evento.target.value);
      }
    } else {
      detalleFormGroup.get(campo)?.patchValue(0);
    }

    const subtotal = detalleFormGroup.get('subtotal') as FormControl;
    const neto = detalleFormGroup.get('neto') as FormControl;
    const total = detalleFormGroup.get('total') as FormControl;
    const arrDetalleImpuestos = detalleFormGroup.get('impuestos') as FormArray;
    const base_impuesto: any = detalleFormGroup.get(
      'base_impuesto',
    ) as FormArray;
    const detalleImpuesto = detalleFormGroup.get('impuesto') as FormArray;
    let impuestoTotal: any = 0;
    this.calcularTotales();

    let impuestoTemporales = arrDetalleImpuestos.value;

    arrDetalleImpuestos.clear();

    impuestoTemporales.map((impuesto: any) => {
      let totalImpuesto =
        (((subtotal.value * impuesto.porcentaje) / 100) *
          impuesto.porcentaje_base) /
        100;
      let baseImpuestoActualizar =
        (subtotal.value * impuesto.porcentaje_base) / 100;
      let impuestoFormGrup = this.formBuilder.group({
        id: [impuesto.impuesto_id ? impuesto.id : null],
        impuesto: [impuesto.impuesto_id ? impuesto.impuesto_id : impuesto.id],
        base: [baseImpuestoActualizar],
        porcentaje: [impuesto.porcentaje],
        total: [totalImpuesto],
        nombre: [impuesto.nombre],
        nombre_extendido: [impuesto.nombre_extendido],
        impuesto_id: [impuesto.impuesto_id],
        impuesto_nombre_extendido: [impuesto.nombre_extendido],
        impuesto_nombre: [impuesto.nombre],
        porcentaje_base: [impuesto.porcentaje_base],
        impuesto_venta: [impuesto.impuesto_venta],
        impuesto_compra: [impuesto.impuesto_compra],
      });
      arrDetalleImpuestos.push(impuestoFormGrup);
      this.acumuladorImpuestos[impuesto.nombre_extendido].total +=
        totalImpuesto - impuesto.total;
      impuestoTotal += totalImpuesto;
      base_impuesto.setValue(baseImpuestoActualizar);
      this.changeDetectorRef.detectChanges();
    });
    neto.patchValue(subtotal.value + impuestoTotal);
    total.patchValue(subtotal.value + impuestoTotal);
    this.calcularTotales();
    detalleImpuesto.setValue(impuestoTotal);
    this.changeDetectorRef.detectChanges();
  }

  agregarImpuesto(
    impuesto: any,
    index: number,
    accion: 'actualizacion' | 'agregar',
  ) {
    const detalleFormGroup = this.detalles.at(index) as FormGroup;
    const subtotal = detalleFormGroup.get('subtotal') as FormControl;
    const neto = detalleFormGroup.get('neto') as FormControl;
    const total = detalleFormGroup.get('total') as FormControl;
    const baseImpuesto = detalleFormGroup.get('base_impuesto') as FormControl;
    const impuestoDetalle = detalleFormGroup.get('impuesto') as FormControl;
    const arrDetalleImpuestos = detalleFormGroup.get('impuestos') as FormArray;
    let impuestoAcumuladoDetalle = 0;
    impuesto = {
      ...impuesto,
      index,
    };
    let totalImpuesto = impuesto.total;
    if (accion == 'agregar') {
      totalImpuesto =
        (((subtotal.value * impuesto.impuesto_porcentaje) / 100) *
          impuesto.impuesto_porcentaje_base) /
        100;
    }

    if (impuesto.hasOwnProperty('impuesto_nombre')) {
      impuesto['nombre'] = impuesto['impuesto_nombre'];
    }
    if (impuesto.hasOwnProperty('impuesto_nombre_extendido')) {
      impuesto['nombre_extendido'] = impuesto['impuesto_nombre_extendido'];
    }
    if (impuesto.hasOwnProperty('impuesto_porcentaje')) {
      impuesto['porcentaje'] = impuesto['impuesto_porcentaje'];
    }
    let baseImpuestoActualizar =
      (subtotal.value * impuesto.impuesto_porcentaje_base) / 100;
    let impuestoFormGrup = this.formBuilder.group({
      id: [accion === 'actualizacion' ? impuesto.id : null], //id tabla intermedia entre documento y impuesto
      impuesto: [impuesto.impuesto_id ? impuesto.impuesto_id : impuesto.id], //id
      base: [baseImpuestoActualizar],
      porcentaje: [impuesto.porcentaje],
      total: [totalImpuesto],
      nombre: [impuesto.nombre],
      nombre_extendido: [impuesto.nombre_extendido],
      impuesto_id: [impuesto.impuesto_id],
      impuesto_nombre_extendido: [impuesto.nombre_extendido],
      impuesto_nombre: [impuesto.nombre],
      porcentaje_base: [impuesto.impuesto_porcentaje_base],
      impuesto_venta: [impuesto.impuesto_venta],
      impuesto_compra: [impuesto.impuesto_compra],
    });
    impuestoAcumuladoDetalle = impuestoDetalle.value + totalImpuesto;
    baseImpuesto.setValue(
      baseImpuestoActualizar === null ? 0 : baseImpuestoActualizar,
    );
    arrDetalleImpuestos.push(impuestoFormGrup);
    this.changeDetectorRef.detectChanges();

    if (!this.acumuladorImpuestos[impuesto.nombre_extendido]) {
      this.acumuladorImpuestos[impuesto.nombre_extendido] = {
        total: totalImpuesto,
        data: [impuesto],
      };
    } else {
      const existingData =
        this.acumuladorImpuestos[impuesto.nombre_extendido].data;

      const impuestoExistente = existingData.find(
        (item: any) => item.index === impuesto.index,
      );

      if (!impuestoExistente) {
        this.acumuladorImpuestos[impuesto.nombre_extendido].total +=
          totalImpuesto;
        this.acumuladorImpuestos[impuesto.nombre_extendido].data.push(impuesto);
      }
    }
    let netoTemporal = total.value;
    if (accion == 'actualizacion') {
      if (detalleFormGroup.value.impuestos.length == 1) {
        netoTemporal = subtotal.value;
        netoTemporal += totalImpuesto;
      } else {
        netoTemporal = neto.value;
        netoTemporal += totalImpuesto;
      }
    }

    if (netoTemporal == 0 || netoTemporal == null) {
      netoTemporal = subtotal.value + totalImpuesto;
    }

    if (accion == 'agregar') {
      netoTemporal += totalImpuesto;
    }

    neto.patchValue(netoTemporal);
    total.patchValue(netoTemporal);
    this.calcularTotales();
    detalleFormGroup.patchValue({
      base_impuesto: baseImpuestoActualizar,
      impuesto: impuestoAcumuladoDetalle,
    });
    this.formularioFactura.markAsTouched();
    this.formularioFactura.markAsDirty();
    this.changeDetectorRef.detectChanges();
  }

  removerImpuesto(impuesto: any, index: number) {
    this.formularioFactura.markAsTouched();
    this.formularioFactura.markAsDirty();
    const detalleFormGroup = this.detalles.at(index) as FormGroup;
    const subtotal = detalleFormGroup.get('subtotal') as FormControl;
    const total = detalleFormGroup.get('total') as FormControl;
    const arrDetalleImpuestos = detalleFormGroup.get('impuestos') as FormArray;
    const arrDetalleImpuestosEliminado = detalleFormGroup.get(
      'impuestos_eliminados',
    ) as FormArray;
    const neto = detalleFormGroup.get('neto') as FormControl;
    const impuestoDetalle = detalleFormGroup.get('impuesto') as FormControl;

    let nuevosImpuestos = arrDetalleImpuestos.value.filter(
      (item: any) => item.impuesto_id !== impuesto.impuesto_id,
    );

    let totalImpuesto =
      (((subtotal.value * impuesto.porcentaje) / 100) *
        impuesto.porcentaje_base) /
      100;
    // let totalImpuesto = (subtotal.value * impuesto.porcentaje) / 100;
    // Limpiar el FormArray actual
    arrDetalleImpuestos.clear();
    if (nuevosImpuestos.length >= 1) {
      detalleFormGroup.patchValue({
        impuesto: impuestoDetalle.value - impuesto.total,
      });
    } else {
      detalleFormGroup.patchValue({
        base_impuesto: 0,
        impuesto: 0,
      });
    }
    // Agregar los impuestos filtrados de nuevo al FormArray
    nuevosImpuestos.forEach((nuevoImpuesto: any) => {
      let totalImpuestoNuevo =
        (((subtotal.value * nuevoImpuesto.porcentaje) / 100) *
          nuevoImpuesto.porcentaje_base) /
        100;
      let baseImpuestoActualizar =
        (subtotal.value * nuevoImpuesto.porcentaje_base) / 100;
      const nuevoDetalle = this.formBuilder.group({
        id: [nuevoImpuesto.id], //id tabla intermedia entre documento y impuesto
        impuesto: [nuevoImpuesto.impuesto], //id
        base: [baseImpuestoActualizar],
        porcentaje: [nuevoImpuesto.porcentaje],
        total: [totalImpuestoNuevo],
        nombre: [nuevoImpuesto.nombre],
        nombre_extendido: [nuevoImpuesto.nombre_extendido],
        impuesto_id: [nuevoImpuesto.impuesto_id],
        impuesto_nombre_extendido: [nuevoImpuesto.nombre_extendido],
        impuesto_nombre: [nuevoImpuesto.nombre],
        porcentaje_base: [nuevoImpuesto.porcentaje_base],
        impuesto_venta: [nuevoImpuesto.impuesto_venta],
        impuesto_compra: [nuevoImpuesto.impuesto_compra],
      });
      arrDetalleImpuestos.push(nuevoDetalle);
    });

    if (impuesto.id) {
      arrDetalleImpuestosEliminado.push(this.formBuilder.control(impuesto.id));
    }

    this.acumuladorImpuestos[impuesto.nombre_extendido].data =
      this.acumuladorImpuestos[impuesto.nombre_extendido].data.filter(
        (impuestoAcumulado: any) => impuestoAcumulado.index !== index,
      );

    if (this.acumuladorImpuestos[impuesto.nombre_extendido].data.length === 0) {
      delete this.acumuladorImpuestos[impuesto.nombre_extendido];
      this.changeDetectorRef.detectChanges();
    }

    if (
      this.acumuladorImpuestos[impuesto.nombre_extendido]?.total !== undefined
    ) {
      this.acumuladorImpuestos[impuesto.nombre_extendido].total -=
        impuesto.total;
    }

    let netoTemporal = neto.value;

    if (netoTemporal > 0) {
      netoTemporal -= totalImpuesto;
    }

    neto.patchValue(netoTemporal);
    total.patchValue(netoTemporal);
    this.calcularTotales();
    this.changeDetectorRef.detectChanges();
  }

  private _inicializarFormulario(contactoId: string) {
    this.filtrosPermanentesNotaCredito = [
      {
        propiedad: 'contacto_id',
        valor1: contactoId,
      },
      {
        propiedad: 'documento_tipo__documento_clase_id',
        valor1: 300,
      },
      {
        propiedad: 'estado_aprobado',
        valor1: true,
      },
    ];
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioFactura?.markAsDirty();
    this.formularioFactura?.markAsTouched();
    if (campo === 'contacto' || campo === 'contactoNuevoModal') {
      this._inicializarFormulario(dato.contacto_id);
      this._limpiarDocumentoReferencia(dato.contacto_id);
      this.formularioFactura.get(campo)?.setValue(dato.contacto_id);
      this.formularioFactura
        .get('contactoNombre')
        ?.setValue(dato.contacto_nombre_corto);
      if (campo === 'contactoNuevoModal') {
        this.formularioFactura.get('contacto')?.setValue(dato.id);
        this.formularioFactura
          .get('contactoNombre')
          ?.setValue(dato.nombre_corto);
      }
      this.formularioFactura.get('plazo_pago')?.setValue(dato.plazo_pago_id);
      if (dato.plazo_pago_dias > 0) {
        this.plazo_pago_dias = dato.plazo_pago_dias;
        const diasNumero = parseInt(this.plazo_pago_dias, 10) + 1;
        const fechaActual = new Date(); // Obtener la fecha actual
        fechaActual.setDate(fechaActual.getDate() + diasNumero);
        const fechaVencimiento = `${fechaActual.getFullYear()}-${(
          fechaActual.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}-${fechaActual
          .getDate()
          .toString()
          .padStart(2, '0')}`;
        // Suma los días a la fecha actual
        this.formularioFactura.get('fecha_vence')?.setValue(fechaVencimiento);
      }

      if (
        this.parametrosUrl?.documento_clase == 2 ||
        this.parametrosUrl?.documento_clase == 3
      ) {
        this.visualizarCampoDocumentoReferencia = true;
        this.changeDetectorRef.detectChanges();
      }
    }
    if (campo === 'metodo_pago') {
      this.formularioFactura.get(campo)?.setValue(dato.metodo_pago_id);
      this.formularioFactura
        .get('metodo_pago_nombre')
        ?.setValue(dato.metodo_pogo_nombre);
    }
    if (campo === 'comentario') {
      if (this.formularioFactura.get(campo)?.value === '') {
        this.formularioFactura.get(campo)?.setValue(null);
      }
    }
    if (campo === 'orden_compra') {
      if (this.formularioFactura.get(campo)?.value === '') {
        this.formularioFactura.get(campo)?.setValue(null);
      }
    }
    if (campo === 'documento_referencia') {
      this.formularioFactura.get(campo)?.setValue(dato.id);
      this.formularioFactura
        .get('documento_referencia_numero')
        ?.setValue(dato.numero);
    }
    this.changeDetectorRef.detectChanges();
  }

  consultarCliente(event: any) {
    let arrFiltros: ParametrosFiltros = {
      filtros: [
        {
          propiedad: 'nombre_corto__icontains',
          valor1: `${event?.target.value}`,
        },
        {
          propiedad: 'proveedor',
          valor1: 'True',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'GenContacto',
      serializador: 'ListaAutocompletar',
    };

    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarGenContacto>(arrFiltros)
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrMovimientosClientes = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe();
  }

  consultarDocumentoReferencia(event: any) {
    let arrFiltros: ParametrosFiltros = {
      filtros: [
        {
          propiedad: 'numero__icontains',
          valor1: `${event?.target.value}`,
        },
        {
          propiedad: 'contacto_id',
          valor1: this.formularioFactura.get('contacto')?.value,
        },
        { propiedad: 'documento_tipo__documento_clase_id', valor1: 300 },
        {
          propiedad: 'estado_aprobado',
          valor1: true,
        },
      ],
      limite: 5,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'GenDocumento',
      serializador: 'Referencia',
    };

    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarGenDocumentoReferencia>(
        arrFiltros,
      )
      .pipe(
        throttleTime(600, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.referencias = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe();
  }

  actualizarDatos(event: any, campo: string) {
    let data: any = {
      documento_tipo: this.dataUrl.documento_tipo,
    };

    data[campo] = event.target.innerText;
    this.facturaService.actualizarDatosFactura(this.detalle, data);
  }

  consultardetalle() {
    this.facturaService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.informacionDetalle = respuesta.documento;
        // this.estado_aprobado = respuesta.documento.estado_aprobado;

        this.formularioFactura.patchValue({
          contacto: respuesta.documento.contacto_id,
          contactoNombre: respuesta.documento.contacto_nombre_corto,
          fecha: respuesta.documento.fecha,
          fecha_vence: respuesta.documento.fecha_vence,
          metodo_pago: respuesta.documento.metodo_pago_id,
          metodo_pago_nombre: respuesta.documento.metodo_pago_nombre,
          orden_compra: respuesta.documento.orden_compra,
          comentario: respuesta.documento.comentario,
          plazo_pago: respuesta.documento.plazo_pago_id,
        });

        if (
          this.parametrosUrl?.documento_clase == 2 ||
          this.parametrosUrl?.documento_clase == 3
        ) {
          this.visualizarCampoDocumentoReferencia = true;
          this.formularioFactura.patchValue({
            documento_referencia: respuesta.documento.documento_referencia_id,
            documento_referencia_numero:
              respuesta.documento.documento_referencia_numero,
          });
        }

        this.detalles.clear();
        respuesta.documento.detalles.forEach(
          (detalle: any, indexDetalle: number) => {
            const detalleFormGroup = this.formBuilder.group({
              item: [detalle.item],
              item_nombre: [detalle.item_nombre],
              cantidad: [detalle.cantidad],
              precio: [detalle.precio],
              porcentaje_descuento: [detalle.porcentaje_descuento],
              descuento: [detalle.descuento],
              subtotal: [detalle.subtotal],
              total_bruto: [detalle.total_bruto],
              total: [detalle.total],
              neto: [detalle.neto],
              base_impuesto: [detalle.base_impuesto],
              impuesto: [0],
              impuestos: this.formBuilder.array([]),
              impuestos_eliminados: this.formBuilder.array([]),
              id: [detalle.id],
              seleccionado: [false],
            });
            this.detalles.push(detalleFormGroup);

            detalle.impuestos.forEach((impuesto: any) => {
              this.agregarImpuesto(impuesto, indexDetalle, 'actualizacion');
            });
          },
        );
        if (respuesta.documento.estado_aprobado) {
          this.formularioFactura.disable();
        } else {
          this.formularioFactura.markAsPristine();
          this.formularioFactura.markAsUntouched();
        }
        this.calcularTotales();
        this.changeDetectorRef.detectChanges();
      });
  }

  cambiarFechaVence(event: any) {
    const fechaFactura = new Date(this.formularioFactura.get('fecha')?.value); // Crear objeto Date a partir del string
    this.formularioFactura.get('plazo_pago')?.value;
    const diasNumero = parseInt(this.plazo_pago_dias, 10);
    // Sumar los días a la fechde la factura
    fechaFactura.setDate(fechaFactura.getDate() + (diasNumero + 1));
    const fechaVencimiento = `${fechaFactura.getFullYear()}-${(
      fechaFactura.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${fechaFactura.getDate().toString().padStart(2, '0')}`;

    // Suma los días a la fecha actual
    this.formularioFactura.get('fecha_vence')?.setValue(fechaVencimiento);
  }

  capturarDias(event: any) {
    // Obtener el valor del atributo data-dias del option seleccionado
    const fechaFactura = new Date(this.formularioFactura.get('fecha')?.value); // Crear objeto Date a partir del string
    this.plazo_pago_dias =
      event.target.selectedOptions[0].getAttribute('data-dias');

    const diasNumero = parseInt(this.plazo_pago_dias, 10);

    // Sumar los días a la fechde la factura
    fechaFactura.setDate(fechaFactura.getDate() + (diasNumero + 1));

    const fechaVencimiento = `${fechaFactura.getFullYear()}-${(
      fechaFactura.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${fechaFactura.getDate().toString().padStart(2, '0')}`;
    // Suma los días a la fecha actual
    this.formularioFactura.get('fecha_vence')?.setValue(fechaVencimiento);
  }

  abrirModalContactoNuevo(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
  }

  cerrarModal(contacto: Contacto) {
    this.modificarCampoFormulario('contactoNuevoModal', contacto);
    this.modalService.dismissAll();
  }

  recibirDocumentoDetalle(documento: DocumentoFacturaRespuesta) {
    this._inicializarFormulario(`${documento.contacto_id}`);
  }

  private _limpiarDocumentoReferencia(contactoId: string) {
    const formularioContactoId = this.formularioFactura.get('contacto')?.value;
    if (formularioContactoId !== contactoId)
      this.formularioFactura.patchValue({
        documento_referencia_numero: null,
        documento_referencia: null,
      });
  }

  onSeleccionarGrupoChange(id: number) {
    this.formularioFactura.get('grupo_contabilidad')?.setValue(id);
  }
}
