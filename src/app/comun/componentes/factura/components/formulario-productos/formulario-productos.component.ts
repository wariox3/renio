import { CommonModule, KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
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
import { ProductosComponent } from '@comun/componentes/productos/productos.component';
import { validarPrecio } from '@comun/validaciones/validar-precio.validate';
import {
  DocumentoDetalleFactura,
  DocumentoFacturaDetalleRespuesta,
  DocumentoFacturaRespuesta,
  ImpuestoFormulario,
  ImpuestoRespuestaConsulta,
  PagoFormulario,
} from '@interfaces/comunes/factura/factura.interface';
import { TranslateModule } from '@ngx-translate/core';
import { documentosEstadosAction } from '@redux/actions/documentosEstadosAction';
import { Subject, takeUntil } from 'rxjs';
import { AdapterService } from '../../services/adapter.service';
import { FacturaService } from '../../services/factura.service';
import { OperacionesService } from '../../services/operaciones.service';
import { SeleccionarImpuestosComponent } from '../seleccionar-impuestos/seleccionar-impuestos.component';
import { SeleccionarProductoComponent } from '../seleccionar-producto/seleccionar-producto.component';

@Component({
  selector: 'app-formulario-productos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ProductosComponent,
    TranslateModule,
    SeleccionarImpuestosComponent,
    SeleccionarProductoComponent,
  ],
  providers: [KeyValuePipe],
  templateUrl: './formulario-productos.component.html',
  styleUrl: './formulario-productos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioProductosComponent
  extends General
  implements OnDestroy, OnInit
{
  @Input({ required: true }) formularioFactura!: FormGroup;
  @Input() formularioTipo: 'venta' | 'compra' = 'venta';
  @Input({ required: true }) modoEdicion: boolean = false;
  @Input() mostrarDocumentoReferencia: boolean = false;
  @Input() estadoAprobado: boolean = false;
  @Input({ required: true }) acumuladorImpuestos: {
    [string: string]: { operado: number; total: number };
  } = {};
  @Output() emitirEnviarFormulario: EventEmitter<void>;
  @Output() emitirDocumentoDetalle: EventEmitter<DocumentoFacturaRespuesta>;
  @Output() emitirImpuestosAcumulados: EventEmitter<{
    [string: string]: { operado: number; total: number };
  }>;

  private _formBuilder = inject(FormBuilder);
  private _adapterService = inject(AdapterService);
  private _operaciones = inject(OperacionesService);
  private _keyValue = inject(KeyValuePipe);
  private _facturaService = inject(FacturaService);
  private _changeDetector = inject(ChangeDetectorRef);
  private _unsubscribe$ = new Subject<void>();
  private _impuestoCache: {
    [string: string]: { operado: number; total: number };
  }[] = [];

  public themeValue = localStorage.getItem('kt_theme_mode_value');

  constructor() {
    super();
    this.emitirEnviarFormulario = new EventEmitter<void>();
    this.emitirImpuestosAcumulados = new EventEmitter();
    this.emitirDocumentoDetalle = new EventEmitter();
  }

  ngOnInit(): void {
    this._cargarVista();
  }

  // listeners
  onCantidadChange(i: number) {
    this.detalles.controls[i]
      .get('cantidad')
      ?.valueChanges.pipe(takeUntil(this._unsubscribe$))
      .subscribe((valor: string) => {
        if (valor) {
          this._actualizarCantidadItem(i, Number(valor));
        }
      });
  }

  onPrecioChange(i: number) {
    this.detalles.controls[i]
      .get('precio')
      ?.valueChanges.pipe(takeUntil(this._unsubscribe$))
      .subscribe((valor: string) => {
        if (valor) {
          this._actualizarPrecioItem(i, Number(valor));
        }
      });
  }

  eliminarItem(indexFormulario: number) {
    const itemsActualizados = this.detalles.value.filter(
      (detalleFormulario: any, index: number) => {
        if (indexFormulario === index) {
          this._registrarItemDetalleEliminado(detalleFormulario.id);
        }
        return index !== indexFormulario;
      }
    );

    this.detalles.clear();
    itemsActualizados.forEach((item: any, i: number) => {
      this.agregarNuevoItem();
      const subtotal = this._operaciones.calcularSubtotal(
        item.cantidad,
        item.precio
      );
      this.detalles.controls[i].patchValue({
        id: item.id || null,
        precio: item.precio,
        item: item.item,
        cantidad: item.cantidad,
        subtotal,
        item_nombre: item.item_nombre,
        total: item.precio * 1,
      });

      this._actualizarImpuestoItem(item.impuestos, i);
    });

    this._limpiarFormularioTotales();
    this._actualizarFormulario();
    this._eliminarPosicionImpuestoCache(indexFormulario);
    this._limpiarImpuestosAcumulados();
  }

  /**
   * Se ejecuta cuando el usuario da clic en agregar nuevo item
   */
  agregarNuevoItem() {
    const detalleFormGroup = this._formBuilder.group({
      item: [null, Validators.compose([Validators.required])],
      item_nombre: [null],
      cantidad: [
        0,
        [
          validarPrecio(),
          Validators.min(1),
          Validators.pattern('^[0-9]+(\\.[0-9]{1,})?$'),
        ],
      ],
      precio: [
        0,
        [
          validarPrecio(),
          Validators.min(1),
          Validators.pattern('^[0-9]+(\\.[0-9]{1,})?$'),
        ],
      ],
      porcentaje_descuento: [0],
      descuento: [0],
      subtotal: [0],
      total: [0],
      impuesto: [0],
      impuesto_operado: [0],
      impuesto_retencion: [0],
      total_bruto: [0],
      neto: [0],
      base_impuesto: [0],
      impuestos: this._formBuilder.array<ImpuestoFormulario[]>([]),
      impuestos_eliminados: this._formBuilder.array([]),
      id: [null],
    });

    this.detalles.push(detalleFormGroup);
    this.detalles?.markAllAsTouched();
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Se ejecuta cuando el usuario selecciona un producto del selector
   *
   * @param item
   * @param indexFormulario
   */
  recibirItemSeleccionado(
    item: DocumentoDetalleFactura,
    indexFormulario: number
  ) {
    const subtotal = this._operaciones.calcularSubtotal(item.precio, 1);

    this.detalles.controls[indexFormulario].patchValue({
      precio: item.precio,
      item: item.id,
      cantidad: 1,
      subtotal,
      item_nombre: item.nombre,
      total: item.precio * 1,
    });

    const impuestosAdaptados = item.impuestos.map((impuesto) =>
      this._adapterService.adaptarImpuesto(impuesto, this.modoEdicion, true)
    );

    this._agregarCampoImpuestoACache(indexFormulario);
    this._actualizarImpuestoItem(impuestosAdaptados, indexFormulario);
    this._limpiarImpuestosAcumulados();
    this._limpiarFormularioTotales();
    this._actualizarFormulario();

    this.formularioFactura?.markAsDirty();
    this.formularioFactura?.markAsTouched();
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Se ejecuta cuando el usuario realiza cambios en el componente de impuestos del item
   *
   * @param impuestos
   * @param indexFormulario
   */
  recibirImpuestosModificados(
    impuestos: ImpuestoRespuestaConsulta[],
    indexFormulario: number
  ) {
    const impuestosAdaptados = impuestos.map((impuesto) =>
      this._adapterService.adaptarImpuesto(impuesto, this.modoEdicion)
    );

    this._registrarImpuestosEliminados(impuestosAdaptados, indexFormulario);
    this._eliminarImpuestoEnCache(indexFormulario);
    this._actualizarImpuestoItem(impuestosAdaptados, indexFormulario);
    this._limpiarImpuestosAcumulados();
    this._limpiarFormularioTotales();
    this._actualizarFormulario();
  }

  // acumulador impuestos
  private _eliminarPosicionImpuestoCache(indexFormulario: number) {
    this._impuestoCache = this._impuestoCache.filter(
      (_, i) => indexFormulario !== i
    );
  }

  private _eliminarImpuestoEnCache(indexFormulario: number) {
    this._impuestoCache = this._impuestoCache.map((impuestoGuardado, i) => {
      if (i === indexFormulario) {
        return {};
      }

      return impuestoGuardado;
    });

    this._limpiarImpuestosAcumulados();
  }

  private _actualizarImpuestosEnCache(
    indexFormulario: number,
    impuestoNombre: string,
    impuestoTotal: number,
    impuestoOperacion: number
  ) {
    this._impuestoCache = this._impuestoCache.map((impuestoGuardado, i) => {
      if (i === indexFormulario) {
        if (!impuestoGuardado[impuestoNombre]) {
          impuestoGuardado[impuestoNombre] = { total: 0, operado: 0 };
        }

        impuestoGuardado[impuestoNombre].total = impuestoTotal;
        impuestoGuardado[impuestoNombre].operado = impuestoOperacion;

        return impuestoGuardado;
      }

      return impuestoGuardado;
    });
  }

  private _agregarCampoImpuestoACache(indexFormulario: number) {
    if (!this._impuestoCache[indexFormulario]) {
      this._impuestoCache.push({});
    } else {
      this._eliminarImpuestoEnCache(indexFormulario);
    }
  }

  private _calcularImpuestosAcumulados() {
    this._impuestoCache?.forEach((impuesto) => {
      if (Object.keys(impuesto).length) {
        const impuestoTransformado = this._keyValue.transform(impuesto);

        for (let { key, value } of impuestoTransformado) {
          if (!this.acumuladorImpuestos[key]) {
            this.acumuladorImpuestos[key] = { total: 0, operado: 0 };
            this.acumuladorImpuestos[key].operado = value.operado;
          }

          if (value.operado > 0) {
            this.acumuladorImpuestos[key].total += value.total;
          } else {
            this.acumuladorImpuestos[key].total -= value.total;
          }
        }

        this.emitirImpuestosAcumulados.emit(this.acumuladorImpuestos);
      }
    });
  }

  private _limpiarImpuestosAcumulados() {
    this.acumuladorImpuestos = {};
    this.emitirImpuestosAcumulados.emit(this.acumuladorImpuestos);

    this._calcularImpuestosAcumulados();
  }

  // funciones documento formulario
  private _actualizarFormulario() {
    let total = this.formularioFactura.get('total')?.value;
    let subtotal = this.formularioFactura.get('subtotal')?.value;
    let impuestoOperado = this.formularioFactura.get('impuesto_operado')?.value;
    let baseImpuesto = this.formularioFactura.get('base_impuesto')?.value;
    let totalCantidad = this.formularioFactura.get('totalCantidad')?.value;
    let totalBruto = this.formularioFactura.get('total_bruto')?.value;

    total += this._operaciones.sumarTotales(this.detalles.value, 'total');
    subtotal += this._operaciones.sumarTotales(this.detalles.value, 'subtotal');
    totalBruto += this._operaciones.sumarTotales(
      this.detalles.value,
      'total_bruto'
    );
    impuestoOperado += this._operaciones.sumarTotales(this.detalles.value, 'impuesto_operado');
    totalCantidad += this._operaciones.sumarTotales(
      this.detalles.value,
      'cantidad'
    );
    baseImpuesto += this._operaciones.sumarTotales(
      this.detalles.value,
      'base_impuesto'
    );

    // impuesto total

    this.formularioFactura.patchValue({
      totalCantidad,
      total,
      subtotal,
      impuesto_operado: impuestoOperado,
      total_bruto: totalBruto,
      base_impuesto: baseImpuesto,
    });
  }

  private _limpiarFormularioTotales() {
    this.formularioFactura.get('total')?.setValue(0);
    this.formularioFactura.get('subtotal')?.setValue(0);
    this.formularioFactura.get('impuesto_operado')?.setValue(0);
    this.formularioFactura.get('base_impuesto')?.setValue(0);
    this.formularioFactura.get('total_bruto')?.setValue(0);
    this.formularioFactura.get('totalCantidad')?.setValue(0);
  }

  // funciones formulario detalle
  private _actualizarCantidadItem(
    indexFormulario: number,
    nuevaCantidad: number
  ) {
    const precio = this.detalles.controls[indexFormulario].get('precio')?.value;
    const subtotalCalculado = this._operaciones.calcularSubtotal(
      nuevaCantidad,
      precio
    );
    const impuestos =
      this.detalles.controls[indexFormulario].get('impuestos')?.value;

    this.detalles.controls[indexFormulario].patchValue({
      subtotal: subtotalCalculado,
    });

    this._actualizarImpuestoItem(impuestos, indexFormulario);
    this._limpiarFormularioTotales();
    this._limpiarImpuestosAcumulados();
    this._actualizarFormulario();
  }

  private _actualizarPrecioItem(indexFormulario: number, nuevoPrecio: number) {
    const cantidad =
      this.detalles.controls[indexFormulario].get('cantidad')?.value;
    const subtotalCalculado = this._operaciones.calcularSubtotal(
      cantidad,
      nuevoPrecio
    );
    const impuestos =
      this.detalles.controls[indexFormulario].get('impuestos')?.value;

    this.detalles.controls[indexFormulario].patchValue({
      subtotal: subtotalCalculado,
    });

    this._actualizarImpuestoItem(impuestos, indexFormulario);
    this._limpiarFormularioTotales();
    this._limpiarImpuestosAcumulados();
    this._actualizarFormulario();
  }

  private _actualizarImpuestoItem(
    impuestos: ImpuestoFormulario[],
    indexFormulario: number
  ) {
    this._limpiarImpuestos(indexFormulario);

    impuestos.forEach((impuesto) => {
      this._calcularImpuestoTotalItem(indexFormulario, impuesto);
    });

    this._cacularTotalItem(indexFormulario);
  }

  private _agregarImpuestoItem(
    impuesto: ImpuestoFormulario,
    indexFormulario: number,
    impuestoCalculado: number,
    impuestoOperado: number
  ) {
    const formularioDetalle = this._obtenerDetalleFormulario(indexFormulario);
    const subtotal = formularioDetalle.get('subtotal')?.value;
    const neto = formularioDetalle.get('total_bruto')?.value;
    const impuestoFormulario = this._obtenerImpuestoFormulario(indexFormulario);
    const impuestoRespuesta = impuestoFormulario.value.find(
      (imp: ImpuestoRespuestaConsulta) =>
        imp.impuesto_nombre === impuesto.impuesto_nombre
    );

    if (!impuestoRespuesta) {
      const baseCalculada = this._operaciones.calcularBase(
        subtotal,
        impuesto.porcentaje_base
      );

      const brutoCalculado =
        this._calcularBruto(impuesto, impuestoOperado) + neto;

      formularioDetalle.patchValue({
        base_impuesto: baseCalculada,
        total_bruto: brutoCalculado,
      });

      const impuestoConTotales: ImpuestoFormulario = {
        ...impuesto,
        total: impuestoCalculado,
        total_operado: impuestoOperado,
        base: baseCalculada,
      };
      impuestoFormulario.push(
        this._formBuilder.control<ImpuestoFormulario>(impuestoConTotales)
      );
    }
  }

  private _calcularBruto(
    impuesto: ImpuestoFormulario,
    impuestoOperado: number
  ): number {
    if (impuesto.impuesto_operacion > 0) {
      return impuestoOperado;
    }

    return 0;
  }

  private _calcularImpuestoTotalItem(
    indexFormulario: number,
    impuesto: ImpuestoFormulario
  ) {
    const detalleFormulario = this._obtenerDetalleFormulario(indexFormulario);
    const impuestoOperadoAcumulado = detalleFormulario.get('impuesto_operado')?.value;
    const subtotal = detalleFormulario.get('subtotal')?.value;

    const baseCalculada = this._operaciones.calcularBase(
      subtotal,
      impuesto.porcentaje_base
    );
    const impuestoCalculado = this._operaciones.calcularImpuesto(
      baseCalculada,
      impuesto.porcentaje
    );
    const impuestoOperado = this._operaciones.calcularImpuestoOperado(
      impuestoCalculado,
      impuesto.impuesto_operacion
    );

    const impuestTotal = this._operaciones.redondear(
      impuestoOperado + impuestoOperadoAcumulado,
      2
    );

    detalleFormulario.patchValue({
      impuesto_operado: impuestTotal,
    });

    this._actualizarImpuestosEnCache(
      indexFormulario,
      impuesto.impuesto_nombre_extendido,
      impuestoCalculado,
      impuesto.impuesto_operacion
    );

    this._agregarImpuestoItem(
      impuesto,
      indexFormulario,
      impuestoCalculado,
      impuestoOperado
    );
  }

  private _cacularTotalItem(indexFormulario: number) {
    const detalleFormulario = this._obtenerDetalleFormulario(indexFormulario);
    const impuestoOperado = detalleFormulario.get('impuesto_operado')?.value;
    const subtotal = detalleFormulario.get('subtotal')?.value;
    const totalBruto = detalleFormulario.get('total_bruto')?.value;
    const baseImpuesto = detalleFormulario.get('base_impuesto')?.value;

    const totalCalculado = this._operaciones.calcularTotal(subtotal, impuestoOperado);
    const totalBrutoCalculado = this._operaciones.calcularTotal(
      subtotal,
      totalBruto
    );

    detalleFormulario.patchValue({
      total: totalCalculado,
      neto: totalCalculado,
      total_bruto: totalBrutoCalculado,
      base_impuesto: baseImpuesto,
    });
  }

  private _limpiarImpuestos(indexFormulario: number) {
    const impuestos = this._obtenerImpuestoFormulario(indexFormulario);
    const impuestoDetalle = this._obtenerDetalleFormulario(indexFormulario);
    this.formularioFactura.get('impuesto_operado')?.setValue(0);
    impuestoDetalle.get('impuesto_operado')?.setValue(0);
    impuestoDetalle.get('base_impuesto')?.setValue(0);
    impuestoDetalle.get('total_bruto')?.setValue(0);
    impuestos.clear();
  }

  private _registrarItemDetalleEliminado(id: string | null) {
    if (!this.modoEdicion || !id) {
      return null;
    }

    this.detallesEliminados.value.push(id);
  }

  // funciones formulario impuestos
  private _registrarImpuestosEliminados(
    impuestosActualizados: ImpuestoFormulario[],
    indexFormulario: number
  ) {
    if (!this.modoEdicion) {
      return;
    }

    const impuestosActuales = this._obtenerImpuestoFormulario(indexFormulario);
    const impuestosEliminados =
      this._obtenerImpuestosEliminados(indexFormulario);

    // validamos que los impuestos recibidos no esten en 0
    if (impuestosActualizados.length <= 0) {
      // agregar lo que que queda en impuestos actuales a los eliminados
      impuestosActuales.value.forEach((impuestoActual: ImpuestoFormulario) => {
        if (impuestoActual.id) {
          impuestosEliminados.value.push(impuestoActual.id);
        }
      });

      return;
    }

    // Mapeamos los ids de los impuestos actualizados para crear un set
    const idsImpuestosActualizados = new Set(
      impuestosActualizados.map((impuesto) => impuesto.id)
    );

    //
    impuestosActuales.value.forEach((impuestoActual: ImpuestoFormulario) => {
      if (!impuestoActual.id) {
        return;
      }

      if (!idsImpuestosActualizados.has(impuestoActual.id)) {
        impuestosEliminados.value.push(impuestoActual.id);
      }
    });
  }

  // cargar vista
  private _cargarFormulario(id: number) {
    this._facturaService
      .consultarDetalleFactura(id)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((respuesta) => {
        this._guardarEstados(respuesta.documento);
        this.emitirDocumentoDetalle.emit(respuesta.documento);
        this._poblarFormulario(respuesta.documento);
      });
  }

  private _guardarEstados(documentoFactura: DocumentoFacturaRespuesta) {
    this.store.dispatch(
      documentosEstadosAction({
        estados: {
          estado_aprobado: documentoFactura.estado_aprobado,
          estado_emitido: documentoFactura.estado_aprobado,
        },
      })
    );
  }

  private _poblarFormulario(documentoFactura: DocumentoFacturaRespuesta) {
    this._poblarDocumento(documentoFactura);
    this._poblarDocumentoDetalle(documentoFactura.detalles);
    this._cargarDocumentoReferencia(documentoFactura);
    this._cargarPagos(documentoFactura);
    this._changeDetector.detectChanges();
  }

  private _cargarDocumentoReferencia(
    documentoFactura: DocumentoFacturaRespuesta
  ) {
    if (this.mostrarDocumentoReferencia) {
      this.formularioFactura.patchValue({
        documento_referencia: documentoFactura.documento_referencia_id,
        documento_referencia_numero:
          documentoFactura.documento_referencia_numero,
      });
    }
  }

  private _cargarPagos(documentoFactura: DocumentoFacturaRespuesta) {
    if (!documentoFactura.pagos.length) {
      return null;
    }

    documentoFactura.pagos.forEach((pago) => {
      const pagoFormGroup = this._formBuilder.group({
        id: pago.id,
        cuenta_banco: pago.cuenta_banco_id,
        cuenta_banco_nombre: pago.cuenta_banco_nombre,
        pago: pago.pago,
      });

      this.pagos.push(pagoFormGroup);
    });

    this._calcularTotalPagos();
  }

  private _calcularTotalPagos() {
    let total: number = 0;
    this.pagos.value.forEach((pagoRealizado: PagoFormulario) => {
      total += pagoRealizado.pago;
    });

    this.totalAfectado.setValue(total);
  }

  private _poblarDocumento(documentoFactura: DocumentoFacturaRespuesta) {
    this.formularioFactura.patchValue({
      contacto: documentoFactura.contacto_id,
      contactoNombre: documentoFactura.contacto_nombre_corto,
      fecha: documentoFactura.fecha,
      fecha_vence: documentoFactura.fecha_vence,
      metodo_pago: documentoFactura.metodo_pago_id,
      metodo_pago_nombre: documentoFactura.metodo_pago_nombre,
      orden_compra: documentoFactura.orden_compra,
      comentario: documentoFactura.comentario,
      plazo_pago: documentoFactura.plazo_pago_id,
    });
  }

  private _poblarDocumentoDetalle(
    documentoDetalle: DocumentoFacturaDetalleRespuesta[]
  ) {
    documentoDetalle.forEach((detalle, indexFormulario) => {
      const documentoDetalleGrupo = this._formBuilder.group({
        item: [detalle.item],
        item_nombre: [detalle.item_nombre],
        cantidad: [detalle.cantidad],
        precio: [detalle.precio],
        porcentaje_descuento: [detalle.porcentaje_descuento],
        descuento: [detalle.descuento],
        subtotal: [detalle.subtotal],
        total_bruto: [detalle.total_bruto],
        total: [detalle.total],
        neto: [0], //TODO: preguntar por que el neto no se esta devolviendo
        base_impuesto: [detalle.base_impuesto],
        impuesto: [detalle.impuesto],
        impuesto_operado: [detalle.impuesto_operado],
        impuestos: this._formBuilder.array([]),
        impuestos_eliminados: this._formBuilder.array([]),
        id: [detalle.id],
      });

      this.detalles.push(documentoDetalleGrupo);
      const impuestosAdaptados = detalle.impuestos.map((impuesto) =>
        this._adapterService.adaptarImpuestoDesdeConsultaDetalle(impuesto)
      );

      this._agregarCampoImpuestoACache(indexFormulario);
      this._actualizarImpuestoItem(impuestosAdaptados, indexFormulario);
    });

    this._limpiarImpuestosAcumulados();
    this._limpiarFormularioTotales();
    this._actualizarFormulario();
  }

  private _cargarVista() {
    if (this.detalle) {
      this.modoEdicion = true;
      this.detalle = this.activatedRoute.snapshot.queryParams['detalle'];
      this._cargarFormulario(this.detalle);
    } else {
      this.modoEdicion = false;
    }
  }

  // funciones impuestos de formulario detalle

  // metodos formulario
  get detalles(): FormArray {
    return this.formularioFactura.get('detalles') as FormArray;
  }

  get detallesEliminados(): FormArray {
    return this.formularioFactura.get('detalles_eliminados') as FormArray;
  }

  get pagos() {
    return this.formularioFactura.get('pagos') as FormArray;
  }

  get totalAfectado() {
    return this.formularioFactura.get('afectado') as FormControl;
  }

  private _obtenerImpuestoFormulario(indexFormulario: number): FormArray {
    const detalle = this._obtenerDetalleFormulario(indexFormulario);
    return detalle.get('impuestos') as FormArray;
  }

  private _obtenerImpuestosEliminados(indexFormulario: number): FormArray {
    const detalle = this._obtenerDetalleFormulario(indexFormulario);
    return detalle.get('impuestos_eliminados') as FormArray;
  }

  private _obtenerDetalleFormulario(indexFormulario: number): FormGroup {
    return this.detalles.at(indexFormulario) as FormGroup;
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
