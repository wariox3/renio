import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
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
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { FormularioFacturaService } from '@comun/services/factura/formulario-factura.service';
import {
  AcumuladorImpuestos,
  DocumentoDetalleFactura,
  DocumentoFacturaRespuesta,
  ImpuestoFormulario,
  ImpuestoRespuestaConsulta,
} from '@interfaces/comunes/factura/factura.interface';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { FacturaService } from '../../services/factura.service';
import { OperacionesService } from '../../services/operaciones.service';
import { SeleccionarImpuestosComponent } from '../seleccionar-impuestos/seleccionar-impuestos.component';
import { SeleccionarProductoComponent } from '../seleccionar-producto/seleccionar-producto.component';
import { SeleccionarAlmacenComponent } from '../seleccionar-almacen/seleccionar-almacen.component';
import { RegistroAutocompletarInvAlmacen } from '@interfaces/comunes/autocompletar/inventario/inv-almacen.interface';
import { SeleccionarGrupoComponent } from '../seleccionar-grupo/seleccionar-grupo.component';

@Component({
  selector: 'app-formulario-productos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    SeleccionarImpuestosComponent,
    SeleccionarProductoComponent,
    NgbTooltipModule,
    SeleccionarAlmacenComponent,
    SeleccionarGrupoComponent,
  ],
  templateUrl: './formulario-productos.component.html',
  styleUrl: './formulario-productos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioProductosComponent
  extends General
  implements OnDestroy, OnInit
{
  private _formBuilder = inject(FormBuilder);
  private _formularioFacturaService = inject(FormularioFacturaService);
  private _operaciones = inject(OperacionesService);
  private _facturaService = inject(FacturaService);
  private _unsubscribe$ = new Subject<void>();
  private _impuestoCache: AcumuladorImpuestos[] =
    this._formularioFacturaService.impuestoCache;

  public formularioFactura = this._formularioFacturaService.form;
  public themeValue = localStorage.getItem('kt_theme_mode_value');
  public modoEdicion = this._formularioFacturaService.modoEdicion;
  public estadoAprobado = this._formularioFacturaService.estadoAprobado;

  @Input() mostrarDocumentoReferencia: boolean = false;
  @Input() cuentasConImpuestos: boolean = false;
  @Input() permiteCantidadCero = false;
  @Input({ required: true }) formularioTipo: 'venta' | 'compra' = 'venta';
  @Output() emitirEnviarFormulario: EventEmitter<void>;
  @Output() emitirDocumentoDetalle: EventEmitter<DocumentoFacturaRespuesta>;

  constructor() {
    super();
    this.emitirEnviarFormulario = new EventEmitter<void>();
    this.emitirDocumentoDetalle = new EventEmitter();
  }

  ngOnInit(): void {
    this._cargarVista();
  }

  // listeners
  onCantidadChange(i: number) {
    this._formularioFacturaService
      .onCantidadChange(i)
      ?.pipe(takeUntil(this._unsubscribe$))
      .subscribe((valor: string) => {
        if (valor) {
          this._formularioFacturaService.actualizarCantidadItem(i);
        }
      });
  }

  onPrecioChange(i: number) {
    this._formularioFacturaService
      .onPrecioChange(i)
      ?.pipe(takeUntil(this._unsubscribe$))
      .subscribe((valor: string) => {
        if (valor) {
          this._formularioFacturaService.actualizarPrecioItem(i);
        }
      });
  }

  onDescuentoChange(i: number) {
    this._formularioFacturaService
      .onDescuentoChange(i)
      ?.pipe(takeUntil(this._unsubscribe$))
      .subscribe((valor: number | null) => {
        const nuevoValor = valor || 0;
        if (nuevoValor >= 0) {
          this._formularioFacturaService.actualizarDescuentoItem(i);
        }
      });
  }

  onSeleccionarGrupoChange(id: string, indexFormulario: number) {
    this._formularioFacturaService.onSeleccionarGrupoChange(
      id,
      indexFormulario,
    );
  }

  eliminarItem(indexFormulario: number) {
    this._formularioFacturaService.eliminarItem(indexFormulario);
  }

  /**
   * Se ejecuta cuando el usuario da clic en agregar nuevo item
   */
  agregarNuevoItem(tipo_registro: string) {
    this._formularioFacturaService.agregarNuevoItem(tipo_registro);
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
    indexFormulario: number,
  ) {
    // const subtotal = this._operaciones.calcularSubtotal(item.precio, 1);
    // this._limpiarPosicionEnImpuestoCache(indexFormulario);
    // this._reiniciarSelectorItem(indexFormulario);

    // const precioDiscriminadoPorTipo = this._discriminarPrecioPorTipo(
    //   this.formularioTipo,
    //   item,
    // );

    // this.detalles.controls[indexFormulario].patchValue({
    //   precio: precioDiscriminadoPorTipo,
    //   item: item.id,
    //   cantidad: 1,
    //   subtotal,
    //   porcentaje_descuento: 0,
    //   item_nombre: item.nombre,
    //   total: precioDiscriminadoPorTipo * 1,
    // });

    // this.changeDetectorRef.detectChanges();

    // const impuestosAdaptados = item.impuestos.map((impuesto) =>
    //   this._adapterService.adaptarImpuesto(impuesto, this.modoEdicion, true),
    // );

    // this._actualizarImpuestoItem(impuestosAdaptados, indexFormulario);
    // this._limpiarImpuestosAcumulados();
    // this._limpiarFormularioTotales();
    // this._actualizarFormulario();

    // this.formularioFactura?.markAsDirty();
    // this.formularioFactura?.markAsTouched();
    this._formularioFacturaService.recibirItemSeleccionado(
      item,
      indexFormulario,
    );
    this.changeDetectorRef.detectChanges();
  }

  private _discriminarPrecioPorTipo(
    formularioTipo: 'venta' | 'compra',
    item: DocumentoDetalleFactura,
  ) {
    return formularioTipo === 'compra' ? item.costo : item.precio;
  }

  private _reiniciarSelectorItem(indexFormulario: number) {
    this.detalles.controls[indexFormulario].patchValue({
      item_nombre: null,
    });

    this.changeDetectorRef.detectChanges();
  }

  private _limpiarPosicionEnImpuestoCache(indexFormulario: number) {
    this._impuestoCache[indexFormulario] = {};
  }

  /**
   * Se ejecuta cuando el usuario selecciona un producto del selector
   *
   * @param item
   * @param indexFormulario
   */
  recibirCuentaSeleccionada(
    item: DocumentoDetalleFactura,
    indexFormulario: number,
  ) {
    this._reiniciarSelectorCuenta(indexFormulario);

    this.detalles.controls[indexFormulario].patchValue({
      cuenta: item.cuenta_id,
      cuenta_codigo: item.cuenta_codigo,
      cuenta_nombre: item.cuenta_nombre,
      cantidad: 1,
    });

    this.changeDetectorRef.detectChanges();

    this._agregarNuevoEspacio();
  }

  private _reiniciarSelectorCuenta(indexFormulario: number) {
    this.detalles.controls[indexFormulario].patchValue({
      cuenta: null,
      cuenta_codigo: null,
      cuenta_nombre: null,
    });

    this.changeDetectorRef.detectChanges();
  }

  recibirAlmacenSeleccionado(
    almacen: RegistroAutocompletarInvAlmacen,
    index: number,
  ) {
    this._formularioFacturaService.onSeleccionarAlmacenChange(almacen, index);
  }

  /**
   * Se ejecuta cuando el usuario realiza cambios en el componente de impuestos del item
   *
   * @param impuestos
   * @param indexFormulario
   */
  recibirImpuestosModificados(
    impuestos: ImpuestoRespuestaConsulta[],
    indexFormulario: number,
  ) {
    // const impuestosAdaptados = impuestos.map((impuesto) =>
    //   this._adapterService.adaptarImpuesto(impuesto, this.modoEdicion),
    // );

    // this._registrarImpuestosEliminados(impuestosAdaptados, indexFormulario);
    // this._eliminarImpuestoEnCache(indexFormulario);
    // this._actualizarImpuestoItem(impuestosAdaptados, indexFormulario);
    // this._limpiarImpuestosAcumulados();
    // this._limpiarFormularioTotales();
    // this._actualizarFormulario();
    this._formularioFacturaService.recibirImpuestosModificados(
      impuestos,
      indexFormulario,
    );
    this.changeDetectorRef.detectChanges();
  }

  // acumulador impuestos
  private _eliminarPosicionImpuestoCache(indexFormulario: number) {
    this._impuestoCache = this._impuestoCache.filter(
      (_, i) => indexFormulario !== i,
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
    impuestoOperacion: number,
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

  private _agregarNuevoEspacio() {
    this._impuestoCache.push({});
  }

  private _agregarCampoImpuestoACache(indexFormulario: number) {
    if (!this._impuestoCache[indexFormulario]) {
      this._agregarNuevoEspacio();
    } else {
      this._eliminarImpuestoEnCache(indexFormulario);
    }
  }

  private _calcularImpuestosAcumulados() {
    // this._impuestoCache?.forEach((impuesto) => {
    //   if (Object.keys(impuesto).length) {
    //     const impuestoTransformado = this._keyValue.transform(impuesto);
    //     for (let { key, value } of impuestoTransformado) {
    //       if (!this.acumuladorImpuestos[key]) {
    //         this.acumuladorImpuestos[key] = { total: 0, operado: 0 };
    //         this.acumuladorImpuestos[key].operado = value.operado;
    //       }
    //       if (value.operado > 0) {
    //         this.acumuladorImpuestos[key].total += value.total;
    //       } else {
    //         this.acumuladorImpuestos[key].total -= value.total;
    //       }
    //     }
    //     this.emitirImpuestosAcumulados.emit(this.acumuladorImpuestos);
    //   }
    // });
  }

  private _limpiarImpuestosAcumulados() {
    // this.acumuladorImpuestos = {};
    // this.emitirImpuestosAcumulados.emit(this.acumuladorImpuestos);
    // this._calcularImpuestosAcumulados();
  }

  // funciones documento formulario
  private _actualizarFormulario() {
    let total = this.formularioFactura.get('total')?.value;
    let subtotal = this.formularioFactura.get('subtotal')?.value;
    let impuestoOperado = this.formularioFactura.get('impuesto_operado')?.value;
    let baseImpuesto = this.formularioFactura.get('base_impuesto')?.value;
    let totalCantidad = this.formularioFactura.get('totalCantidad')?.value;
    let totalBruto = this.formularioFactura.get('total_bruto')?.value;
    let impuesto = this.formularioFactura.get('impuesto')?.value;
    let impuestoRetencion =
      this.formularioFactura.get('impuesto_retencion')?.value;
    let descuento = this.formularioFactura.get('descuento')?.value;

    total += this._operaciones.sumarTotales(this.detalles.value, 'total');
    descuento += this._operaciones.sumarTotales(
      this.detalles.value,
      'descuento',
    );
    subtotal += this._operaciones.sumarTotales(this.detalles.value, 'subtotal');
    impuesto += this._operaciones.sumarTotales(this.detalles.value, 'impuesto');
    impuestoRetencion += this._operaciones.sumarTotales(
      this.detalles.value,
      'impuesto_retencion',
    );
    totalBruto += this._operaciones.sumarTotales(
      this.detalles.value,
      'total_bruto',
    );
    impuestoOperado += this._operaciones.sumarTotales(
      this.detalles.value,
      'impuesto_operado',
    );
    totalCantidad += this._operaciones.sumarTotales(
      this.detalles.value,
      'cantidad',
    );
    baseImpuesto += this._operaciones.sumarTotales(
      this.detalles.value,
      'base_impuesto',
    );

    // impuesto total

    this.formularioFactura.patchValue({
      descuento,
      totalCantidad,
      total,
      subtotal,
      impuesto_operado: impuestoOperado,
      total_bruto: totalBruto,
      base_impuesto: baseImpuesto,
      impuesto,
      impuesto_retencion: impuestoRetencion,
    });
  }

  private _limpiarFormularioTotales() {
    this.formularioFactura.get('total')?.setValue(0);
    this.formularioFactura.get('subtotal')?.setValue(0);
    this.formularioFactura.get('impuesto_operado')?.setValue(0);
    this.formularioFactura.get('descuento')?.setValue(0);
    this.formularioFactura.get('base_impuesto')?.setValue(0);
    this.formularioFactura.get('total_bruto')?.setValue(0);
    this.formularioFactura.get('totalCantidad')?.setValue(0);
    this.formularioFactura.get('impuesto')?.setValue(0);
    this.formularioFactura.get('impuesto_retencion')?.setValue(0);
  }

  // funciones formulario detalle
  private _actualizarCantidadItem(
    indexFormulario: number,
    nuevaCantidad: number,
  ) {
    //valorCero

    const impuestos =
      this.detalles.controls[indexFormulario].get('impuestos')?.value;

    this._actualizarImpuestoItem(impuestos, indexFormulario);
    this._limpiarFormularioTotales();
    this._limpiarImpuestosAcumulados();
    this._actualizarFormulario();
  }

  private _actualizarPrecioItem(indexFormulario: number, nuevoPrecio: number) {
    const impuestos =
      this.detalles.controls[indexFormulario].get('impuestos')?.value;

    this._actualizarImpuestoItem(impuestos, indexFormulario);
    this._limpiarFormularioTotales();
    this._limpiarImpuestosAcumulados();
    this._actualizarFormulario();
  }

  private _actualizarDescuentoItem(
    indexFormulario: number,
    nuevoDescuento: number,
  ) {
    const impuestos =
      this.detalles.controls[indexFormulario].get('impuestos')?.value;

    this._actualizarImpuestoItem(impuestos, indexFormulario);
    this._limpiarFormularioTotales();
    this._limpiarImpuestosAcumulados();
    this._actualizarFormulario();
  }

  private _calcularSubtotal(
    indexFormulario: number,
    nuevaCantidad?: number,
    nuevoPrecio?: number,
  ) {
    const formularioDetalle = this._obtenerDetalleFormulario(indexFormulario);
    const cantidad =
      nuevaCantidad ||
      this.detalles.controls[indexFormulario].get('cantidad')?.value;
    const precio =
      nuevoPrecio ||
      this.detalles.controls[indexFormulario].get('precio')?.value;

    const subtotalCalculado = this._operaciones.calcularSubtotal(
      cantidad,
      precio,
    );

    formularioDetalle.patchValue({
      subtotal: subtotalCalculado,
    });
  }

  private _actualizarImpuestoItem(
    impuestos: ImpuestoFormulario[],
    indexFormulario: number,
  ) {
    this._limpiarImpuestos(indexFormulario);
    this._calcularSubtotal(indexFormulario);
    this._calcularDescuento(indexFormulario);
    this._calcularSubtotalConDescuento(indexFormulario);

    impuestos.forEach((impuesto) => {
      this._calcularImpuestoTotalItem(indexFormulario, impuesto);
    });

    this._cacularTotalItem(indexFormulario);
  }

  private _calcularSubtotalConDescuento(indexFormulario: number) {
    const formularioDetalle = this._obtenerDetalleFormulario(indexFormulario);
    const subtotal = formularioDetalle.get('subtotal')?.value;
    const descuento = formularioDetalle.get('descuento')?.value || 0;

    const subtotalConDescuentoCalculado = subtotal - descuento;

    formularioDetalle.patchValue({
      subtotal: subtotalConDescuentoCalculado,
    });
  }

  private _calcularDescuento(indexFormulario: number) {
    const formularioDetalle = this._obtenerDetalleFormulario(indexFormulario);
    const subtotal = formularioDetalle.get('subtotal')?.value;
    const porcentajeDescuento =
      formularioDetalle.get('porcentaje_descuento')?.value || 0;

    const descuentoCalculado = this._operaciones.calcularDescuento(
      subtotal,
      porcentajeDescuento,
    );

    formularioDetalle.patchValue({
      descuento: descuentoCalculado,
    });
  }

  private _agregarImpuestoItem(
    impuesto: ImpuestoFormulario,
    indexFormulario: number,
    impuestoCalculado: number,
    impuestoOperado: number,
  ) {
    const formularioDetalle = this._obtenerDetalleFormulario(indexFormulario);
    const subtotal = formularioDetalle.get('subtotal')?.value;
    const neto = formularioDetalle.get('total_bruto')?.value;
    const impuestoFormulario = this._obtenerImpuestoFormulario(indexFormulario);
    const impuestoRespuesta = impuestoFormulario.value.find(
      (imp: ImpuestoRespuestaConsulta) =>
        imp.impuesto_nombre === impuesto.impuesto_nombre,
    );

    if (!impuestoRespuesta) {
      const baseCalculada = this._operaciones.calcularBase(
        subtotal,
        impuesto.porcentaje_base,
      );

      const brutoCalculado =
        this._calcularBruto(impuesto, impuestoOperado) + neto;

      this._asignarBaseImpuestoDetalle(
        impuesto,
        baseCalculada,
        formularioDetalle,
      );

      formularioDetalle.patchValue({
        total_bruto: brutoCalculado,
      });

      const impuestoConTotales: ImpuestoFormulario = {
        ...impuesto,
        total: impuestoCalculado,
        total_operado: impuestoOperado,
        base: baseCalculada,
      };
      impuestoFormulario.push(
        this._formBuilder.control<ImpuestoFormulario>(impuestoConTotales),
      );
    }
  }

  private _asignarBaseImpuestoDetalle(
    impuesto: ImpuestoFormulario,
    baseCalculada: number,
    formularioDetalle: FormGroup,
  ) {
    if (impuesto.impuesto_operacion > 0) {
      formularioDetalle.patchValue({
        base_impuesto: baseCalculada,
      });
    }
  }

  private _calcularBruto(
    impuesto: ImpuestoFormulario,
    impuestoOperado: number,
  ): number {
    if (impuesto.impuesto_operacion > 0) {
      return impuestoOperado;
    }

    return 0;
  }

  private _calcularImpuestoTotalItem(
    indexFormulario: number,
    impuesto: ImpuestoFormulario,
  ) {
    const detalleFormulario = this._obtenerDetalleFormulario(indexFormulario);
    const impuestoOperadoAcumulado =
      detalleFormulario.get('impuesto_operado')?.value;
    const impuestoAcumulado = detalleFormulario.get('impuesto')?.value;
    const impuestoRetencionAcumulado =
      detalleFormulario.get('impuesto_retencion')?.value;
    const subtotal = detalleFormulario.get('subtotal')?.value;

    const baseCalculada = this._operaciones.calcularBase(
      subtotal,
      impuesto.porcentaje_base,
    );
    const impuestoCalculado = this._operaciones.calcularImpuesto(
      baseCalculada,
      impuesto.porcentaje,
    );
    const impuestoOperado = this._operaciones.calcularImpuestoOperado(
      impuestoCalculado,
      impuesto.impuesto_operacion,
    );

    const impuestTotal = this._operaciones.redondear(
      impuestoOperado + impuestoOperadoAcumulado,
      2,
    );

    const { impuestoIva, impuestoRetencion } = this._calcularImpuestosDetalles(
      impuesto,
      impuestoOperado,
    );

    detalleFormulario.patchValue({
      impuesto_operado: impuestTotal,
      impuesto: impuestoIva + impuestoAcumulado,
      impuesto_retencion: impuestoRetencion + impuestoRetencionAcumulado,
    });

    this._actualizarImpuestosEnCache(
      indexFormulario,
      impuesto.impuesto_nombre_extendido,
      impuestoCalculado,
      impuesto.impuesto_operacion,
    );

    this._agregarImpuestoItem(
      impuesto,
      indexFormulario,
      impuestoCalculado,
      impuestoOperado,
    );
  }

  private _calcularImpuestosDetalles(
    impuesto: ImpuestoFormulario,
    impuestoOperado: number,
  ): {
    impuestoIva: number;
    impuestoRetencion: number;
  } {
    let impuestos = { impuestoIva: 0, impuestoRetencion: 0 };

    if (impuesto.impuesto_operacion > 0) {
      impuestos.impuestoIva = impuestoOperado;
    } else if (impuesto.impuesto_operacion < 0) {
      impuestos.impuestoRetencion = impuestoOperado;
    }

    return impuestos;
  }

  private _cacularTotalItem(indexFormulario: number) {
    const detalleFormulario = this._obtenerDetalleFormulario(indexFormulario);
    const impuestoOperado = detalleFormulario.get('impuesto_operado')?.value;
    const subtotal = detalleFormulario.get('subtotal')?.value;
    const totalBruto = detalleFormulario.get('total_bruto')?.value;
    const baseImpuesto = detalleFormulario.get('base_impuesto')?.value;

    const totalCalculado = this._operaciones.calcularTotal(
      subtotal,
      impuestoOperado,
    );
    const totalBrutoCalculado = this._operaciones.calcularTotal(
      subtotal,
      totalBruto,
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
    impuestoDetalle.get('impuesto')?.setValue(0);
    impuestoDetalle.get('impuesto_retencion')?.setValue(0);
    impuestoDetalle.get('base_impuesto')?.setValue(0);
    impuestoDetalle.get('total_bruto')?.setValue(0);
    impuestos.clear();
  }

  // funciones formulario impuestos

  // cargar vista
  private _cargarFormulario(id: number) {
    this._facturaService
      .consultarDetalleFactura(id)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((respuesta) => {
        this.emitirDocumentoDetalle.emit(respuesta.documento);
        this._poblarFormulario(respuesta.documento);
      });
  }

  private _poblarFormulario(documentoFactura: DocumentoFacturaRespuesta) {
    this.estadoAprobado.set(documentoFactura.estado_aprobado);
    this._formularioFacturaService.poblarDocumento(documentoFactura);
    this._formularioFacturaService.poblarDocumentoDetalle(
      documentoFactura.detalles,
    );
    this._formularioFacturaService.cargarDocumentoReferencia(documentoFactura);
    this._formularioFacturaService.cargarPagos(documentoFactura);
    this.changeDetectorRef.detectChanges();
  }

  private _cargarVista() {
    if (this.detalle) {
      this.modoEdicion.set(true);
      this.detalle = this.activatedRoute.snapshot.queryParams['detalle'];
      this._cargarFormulario(this.detalle);
    } else {
      this.modoEdicion.set(false);
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
