import { inject, Injectable, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AdapterService } from '@comun/componentes/factura/services/adapter.service';
import { OperacionesService } from '@comun/componentes/factura/services/operaciones.service';
import { cambiarVacioPorNulo } from '@comun/validaciones/campo-no-obligatorio.validator';
import { validarDescuento } from '@comun/validaciones/validar-descuento.validator';
import { validarPrecio } from '@comun/validaciones/validar-precio.validator';
import {
  AcumuladorDebitosCreditos,
  AcumuladorImpuestos,
  DocumentoDetalleFactura,
  DocumentoFacturaDetalleRespuesta,
  DocumentoFacturaRespuesta,
  ImpuestoFormulario,
  ImpuestoRespuestaConsulta,
  PagoFormulario,
} from '@interfaces/comunes/factura/factura.interface';
import { BehaviorSubject } from 'rxjs';
import { FechasService } from '../fechas.service';
import { RegistroAutocompletarInvAlmacen } from '@interfaces/comunes/autocompletar/inventario/inv-almacen.interface';
import { RegistroAutocompletarGenContacto } from '@interfaces/comunes/autocompletar/general/gen-contacto.interface';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import { Router } from '@angular/router';
import { informacionMenuItem } from '@interfaces/menu/menu';

@Injectable({
  providedIn: 'any',
})
export class FormularioFacturaService {
  private readonly _fechasService = inject(FechasService);
  private readonly _formBuilder = inject(FormBuilder);
  private _adapterService = inject(AdapterService);
  private _operaciones = inject(OperacionesService);
  private formSubject = new BehaviorSubject<FormGroup>(this.createForm());
  private facturaService = inject(FacturaService);
  private _router = inject(Router);

  public eliminarDetallesIds = signal<number[]>([]);
  public impuestoCache: AcumuladorImpuestos[] = [];
  public formularioTipo = signal<'venta' | 'compra'>('venta'); // conectar
  public mostrarDocumentoReferencia = signal<boolean>(false); // conectar
  public modoEdicion = signal<boolean>(false);
  public acumuladorImpuestos = signal<AcumuladorImpuestos>({});
  public acumuladorDebitosCreditos = signal<AcumuladorDebitosCreditos>({
    debitos: {
      total: 0,
      operado: -1,
    },
    creditos: {
      total: 0,
      operado: 1,
    },
  });
  public estadoAprobado = signal<boolean>(false);
  public form$ = this.formSubject.asObservable();

  constructor() {}

  createForm(): FormGroup {
    const fechaVencimientoInicial =
      this._fechasService.getFechaVencimientoInicial();
    return this._formBuilder.group(
      {
        empresa: [1],
        contacto: ['', Validators.required],
        totalCantidad: [0],
        contactoNombre: [''],
        numero: [null],
        fecha: [
          fechaVencimientoInicial,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(200),
            Validators.pattern(/^[a-z-0-9.-_]*$/),
          ]),
        ],
        fecha_vence: [
          fechaVencimientoInicial,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(200),
            Validators.pattern(/^[a-z-0-9.-_]*$/),
          ]),
        ],
        forma_pago: [null],
        forma_pago_nombre: [''],
        metodo_pago: [1, Validators.required],
        metodo_pago_nombre: [''],
        almacen: [null],
        almacen_nombre: [''],
        total: [0],
        subtotal: [0],
        base_impuesto: [0],
        impuesto: [0],
        impuesto_operado: [0],
        impuesto_retencion: [0],
        afectado: [0],
        total_bruto: [0],
        comentario: [null, Validators.maxLength(500)],
        orden_compra: [null, Validators.maxLength(50)],
        documento_referencia: [null],
        documento_referencia_numero: [null],
        asesor: [''],
        asesor_nombre_corto: [null],
        sede: [''],
        resolucion: [''],
        resolucion_numero: [''],
        descuento: [0],
        sede_nombre: [null],
        grupo_contabilidad: [null],
        plazo_pago: [1, Validators.required],
        detalles: this._formBuilder.array([]),
        pagos: this._formBuilder.array([]),

        referencia_cue: [null, [Validators.maxLength(150)]], // Referencia CUE
        referencia_numero: [null, [cambiarVacioPorNulo.validar]], // Referencia número
        referencia_prefijo: [null, [Validators.maxLength(50)]], // Referencia prefijo

        detalles_eliminados: this._formBuilder.array([]),
        pagos_eliminados: this._formBuilder.array([]),
      },
      {
        validator: this.validarFecha,
      },
    );
  }

  onPrecioChange(i: number) {
    return this.detalles.controls[i].get('precio')?.valueChanges;
  }

  onNaturalezaChange(i: number) {
    return this.detalles.controls[i].get('naturaleza')?.valueChanges;
  }

  onCantidadChange(i: number) {
    return this.detalles.controls[i].get('cantidad')?.valueChanges;
  }

  onDescuentoChange(i: number) {
    return this.detalles.controls[i].get('porcentaje_descuento')?.valueChanges;
  }

  onSeleccionarGrupoChange(id: number, indexFormulario: number) {
    this.detalles.controls[indexFormulario].get('grupo')?.setValue(id);
  }

  onSeleccionarAlmacenChange(
    almacen: RegistroAutocompletarInvAlmacen | null,
    indexFormulario: number,
  ) {
    if (!almacen) {
      this.detalles.controls[indexFormulario].get('almacen')?.setValue(null);
      this.detalles.controls[indexFormulario]
        .get('almacen_nombre')
        ?.setValue('');
    } else {
      this.detalles.controls[indexFormulario]
        .get('almacen')
        ?.setValue(almacen.almacen_id);
      this.detalles.controls[indexFormulario]
        .get('almacen_nombre')
        ?.setValue(almacen.almacen_nombre);
    }
  }

  onSeleccionarContactoChange(
    contacto: RegistroAutocompletarGenContacto | null,
    indexFormulario: number,
  ) {
    if (!contacto) {
      this.detalles.controls[indexFormulario].get('contacto')?.setValue(null);
      this.detalles.controls[indexFormulario]
        .get('contacto_nombre')
        ?.setValue('');
    } else {
      this.detalles.controls[indexFormulario]
        .get('contacto')
        ?.setValue(contacto.contacto_id);
      this.detalles.controls[indexFormulario]
        .get('contacto_nombre')
        ?.setValue(contacto.contacto_nombre_corto);
    }
  }

  eliminarItem(indexFormulario: number) {
    const itemsActualizados = this.detalles.value.filter(
      (detalleFormulario: any, index: number) => {
        if (indexFormulario === index) {
          this._registrarItemDetalleEliminado(detalleFormulario.id);
        }
        return index !== indexFormulario;
      },
    );

    this.impuestoCache = [];
    this.acumuladorImpuestos.set({});

    this.detalles.clear();
    itemsActualizados.forEach((item: any, i: number) => {
      this.agregarNuevoItem(item.tipo_registro);
      const subtotal = this._operaciones.calcularSubtotal(
        item.cantidad,
        item.precio,
      );
      this.detalles.controls[i].patchValue({
        id: item.id || null,
        cuenta: item.cuenta,
        cuenta_codigo: item.cuenta_codigo,
        cuenta_nombre: item.cuenta_nombre,
        precio: item.precio,
        item: item.item,
        cantidad: item.cantidad,
        subtotal,
        item_nombre: item.item_nombre,
        total: item.precio * 1,
        naturaleza: item.naturaleza,
        grupo: item.grupo,
        base: item.base,
        almacen: item.almacen,
        almacen_nombre: item.almacen_nombre,
        contacto: item.contacto,
        contacto_nombre: item.contacto_nombre,
      });
      this._agregarCampoImpuestoACache(i);
      this._actualizarImpuestoItem(item.impuestos, i);
    });

    this._limpiarFormularioTotales();
    this._actualizarFormulario();
    this._limpiarImpuestosAcumulados();
  }

  private _registrarItemDetalleEliminado(id: number | null) {
    if (!this.modoEdicion || !id) {
      return null;
    }

    this.eliminarDetallesIds.update((ids) => [...ids, id]);
  }

  private _agregarCampoImpuestoACache(indexFormulario: number) {
    if (!this.impuestoCache[indexFormulario]) {
      this._agregarNuevoEspacio();
    } else {
      this._eliminarImpuestoEnCache(indexFormulario);
    }
  }

  private _eliminarImpuestoEnCache(indexFormulario: number) {
    this.impuestoCache = this.impuestoCache.map((impuestoGuardado, i) => {
      if (i === indexFormulario) {
        return {};
      }

      return impuestoGuardado;
    });

    this._limpiarImpuestosAcumulados();
  }

  actualizarCantidadItem(indexFormulario: number) {
    //valorCero

    const impuestos =
      this.detalles.controls[indexFormulario].get('impuestos')?.value;

    this._actualizarImpuestoItem(impuestos, indexFormulario);
    this._limpiarFormularioTotales();
    this._limpiarImpuestosAcumulados();
    this._actualizarFormulario();
  }

  actualizarPrecioItem(indexFormulario: number) {
    const impuestos =
      this.detalles.controls[indexFormulario].get('impuestos')?.value;

    this._actualizarImpuestoItem(impuestos, indexFormulario);
    this._limpiarFormularioTotales();
    this._limpiarImpuestosAcumulados();
    this._actualizarFormulario();
  }

  actualizarDescuentoItem(indexFormulario: number) {
    const impuestos =
      this.detalles.controls[indexFormulario].get('impuestos')?.value;

    this._actualizarImpuestoItem(impuestos, indexFormulario);
    this._limpiarFormularioTotales();
    this._limpiarImpuestosAcumulados();
    this._actualizarFormulario();
  }

  /**
   * Se ejecuta cuando el usuario da clic en agregar nuevo item
   */
  agregarNuevoItem(tipo_registro: string) {
    let detalleFormGroup: FormGroup;

    if (tipo_registro === 'C') {
      const tipoSugerido = this._sugerirGrupo();
      const { contactoId, contactoNombre } = this._sugerirContacto();

      detalleFormGroup = this._formBuilder.group({
        cuenta: [null],
        cuenta_codigo: [null],
        cuenta_nombre: [null],
        item: [null],
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
            Validators.min(0.1),
            Validators.pattern('^[0-9]+(\\.[0-9]{1,})?$'),
          ],
        ],
        porcentaje_descuento: [
          0,
          [
            validarDescuento(),
            Validators.min(0),
            Validators.max(100),
            Validators.pattern('^[0-9]+(\\.[0-9]{1,})?$'),
          ],
        ],
        contacto: [contactoId],
        contacto_nombre: [contactoNombre],
        descuento: [0],
        subtotal: [0],
        grupo: [tipoSugerido],
        total: [0],
        impuesto: [0],
        impuesto_operado: [0],
        impuesto_retencion: [0],
        total_bruto: [0],
        neto: [0],
        base_impuesto: [0],
        base: [0],
        impuestos: this._formBuilder.array<ImpuestoFormulario[]>([]),
        impuestos_eliminados: this._formBuilder.array([]),
        id: [null],
        tipo_registro: [tipo_registro],
        naturaleza: ['D'],
        almacen: [null],
        almacen_nombre: [''],
      });

      detalleFormGroup.get('cuenta')?.setErrors({ required: true });
      detalleFormGroup.get('cuenta')?.markAsTouched();
      this.impuestoCache.push({});
      this.detalles.push(detalleFormGroup);
      this.detalles?.markAllAsTouched();
    }

    if (tipo_registro === 'I') {
      const tipoSugerido = this._sugerirGrupo();
      const { almacenId, almacenNombre } = this._sugerirAlmacen();

      detalleFormGroup = this._formBuilder.group({
        cuenta: [null],
        cuenta_codigo: [null],
        cuenta_nombre: [null],
        item: [null],
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
            Validators.min(0.1),
            Validators.pattern('^[0-9]+(\\.[0-9]{1,})?$'),
          ],
        ],
        porcentaje_descuento: [
          0,
          [
            validarDescuento(),
            Validators.min(0),
            Validators.max(100),
            Validators.pattern('^[0-9]+(\\.[0-9]{1,})?$'),
          ],
        ],
        descuento: [0],
        subtotal: [0],
        total: [0],
        impuesto: [0],
        impuesto_operado: [0],
        impuesto_retencion: [0],
        total_bruto: [0],
        neto: [0],
        grupo: [tipoSugerido],
        base_impuesto: [0],
        almacen: [almacenId],
        almacen_nombre: [almacenNombre],
        impuestos: this._formBuilder.array<ImpuestoFormulario[]>([]),
        impuestos_eliminados: this._formBuilder.array([]),
        id: [null],
        tipo_registro: [tipo_registro],
        naturaleza: [null],
      });

      detalleFormGroup.get('item')?.setErrors({ required: true });
      detalleFormGroup.get('item')?.markAsTouched();
      this.impuestoCache.push({});
      this.detalles.push(detalleFormGroup);
      this.detalles?.markAllAsTouched();
    }

    // Actualizar los validadores dinámicos
    // detalleFormGroup.get('cuenta')?.updateValueAndValidity();
    // detalleFormGroup.get('item')?.updateValueAndValidity();
    // this.impuestoCache.push({});
    // this.detalles.push(detalleFormGroup);
    // this.detalles?.markAllAsTouched();
    // this.changeDetectorRef.detectChanges();
  }

  private _sugerirGrupo() {
    return this.form.get('grupo_contabilidad')?.value;
  }

  private _sugerirAlmacen() {
    const almacenId = this.form.get('almacen')?.value;
    const almacenNombre = this.form.get('almacen_nombre')?.value;

    return {
      almacenId,
      almacenNombre,
    };
  }

  private _sugerirContacto() {
    const contactoId = this.form.get('contacto')?.value;
    const contactoNombre = this.form.get('contactoNombre')?.value;

    return {
      contactoId,
      contactoNombre,
    };
  }

  submitActualizarFactura(
    basePath: string,
    detalleId: number,
    parametrosUrl: Partial<informacionMenuItem['data']>,
  ) {
    this.facturaService
      .actualizarDatosFactura(detalleId, {
        ...this.form.value,
        detalles_eliminados: this.eliminarDetallesIds(),
      })
      .subscribe((respuesta) => {
        this.eliminarDetallesIds.set([]);
        this._router.navigate([`${basePath}/documento/detalle/${respuesta.documento.id}`], {
          queryParams: {
            ...parametrosUrl,
          },
        });
      });
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
    const subtotal = this._operaciones.calcularSubtotal(item.precio, 1);
    this._limpiarPosicionEnImpuestoCache(indexFormulario);
    this._reiniciarSelectorItem(indexFormulario);

    const precioDiscriminadoPorTipo = this._discriminarPrecioPorTipo(
      this.formularioTipo(),
      item,
    );

    this.detalles.controls[indexFormulario].patchValue({
      precio: precioDiscriminadoPorTipo,
      item: item.id,
      cantidad: 1,
      subtotal,
      porcentaje_descuento: 0,
      item_nombre: item.nombre,
      total: precioDiscriminadoPorTipo * 1,
    });

    // this.changeDetectorRef.detectChanges();

    const impuestosAdaptados = item.impuestos.map((impuesto) =>
      this._adapterService.adaptarImpuesto(impuesto, this.modoEdicion(), true),
    );

    this._actualizarImpuestoItem(impuestosAdaptados, indexFormulario);
    this._limpiarImpuestosAcumulados();
    this._limpiarFormularioTotales();
    this._actualizarFormulario();

    this.form?.markAsDirty();
    this.form?.markAsTouched();
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
    const impuestosAdaptados = impuestos.map((impuesto) =>
      this._adapterService.adaptarImpuesto(impuesto, this.modoEdicion()),
    );

    this._registrarImpuestosEliminados(impuestosAdaptados, indexFormulario);
    this._eliminarImpuestoEnCache(indexFormulario);
    this._actualizarImpuestoItem(impuestosAdaptados, indexFormulario);
    this._limpiarImpuestosAcumulados();
    this._limpiarFormularioTotales();
    this._actualizarFormulario();
  }

  private _registrarImpuestosEliminados(
    impuestosActualizados: ImpuestoFormulario[],
    indexFormulario: number,
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
      impuestosActualizados.map((impuesto) => impuesto.id),
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

    // this.changeDetectorRef.detectChanges();
  }

  private _limpiarPosicionEnImpuestoCache(indexFormulario: number) {
    this.impuestoCache[indexFormulario] = {};
  }

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

    this._agregarNuevoEspacio();
  }

  private _limpiarImpuestosAcumulados() {
    this.acumuladorImpuestos.set({});
    this._calcularImpuestosAcumulados();
  }

  private _calcularImpuestosAcumulados() {
    this.impuestoCache?.forEach((impuesto) => {
      if (Object.keys(impuesto).length) {
        const impuestoTransformado = this._transformKeyValue(impuesto);

        // Obtenemos el valor actual del signal
        const currentAcumulador = this.acumuladorImpuestos();

        // Creamos una copia del acumulador para modificarlo
        const newAcumulador = { ...currentAcumulador };

        for (let { key, value } of impuestoTransformado) {
          if (!newAcumulador[key]) {
            newAcumulador[key] = { total: 0, operado: 0 };
            newAcumulador[key].operado = value.operado;
          }

          if (value.operado > 0) {
            newAcumulador[key].total += value.total;
          } else {
            newAcumulador[key].total -= value.total;
          }
        }

        // Actualizamos el signal con el nuevo valor
        this.acumuladorImpuestos.set(newAcumulador);
      }
    });
  }

  private _actualizarAcumuladorDebitosCreditos(
    creditos: number,
    debitos: number,
  ) {
    const currentAcumulador = this.acumuladorDebitosCreditos();
    const newAccumulador = { ...currentAcumulador };

    newAccumulador['creditos'].total = creditos;
    newAccumulador['debitos'].total = debitos;

    this.acumuladorDebitosCreditos.set(newAccumulador);
  }

  private _limpiarFormularioTotales() {
    this.form.get('total')?.setValue(0);
    this.form.get('subtotal')?.setValue(0);
    this.form.get('impuesto_operado')?.setValue(0);
    this.form.get('descuento')?.setValue(0);
    this.form.get('base_impuesto')?.setValue(0);
    this.form.get('total_bruto')?.setValue(0);
    this.form.get('totalCantidad')?.setValue(0);
    this.form.get('impuesto')?.setValue(0);
    this.form.get('impuesto_retencion')?.setValue(0);
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
      impuesto: this._operaciones.redondear(impuestoIva + impuestoAcumulado, 2),
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

  private _calcularBruto(
    impuesto: ImpuestoFormulario,
    impuestoOperado: number,
  ): number {
    if (impuesto.impuesto_operacion > 0) {
      return impuestoOperado;
    }

    return 0;
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

  private _actualizarImpuestosEnCache(
    indexFormulario: number,
    impuestoNombre: string,
    impuestoTotal: number,
    impuestoOperacion: number,
  ) {
    this.impuestoCache = this.impuestoCache.map((impuestoGuardado, i) => {
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

    // this._calcularDebitosCreditos(indexFormulario);

    formularioDetalle.patchValue({
      subtotal: subtotalCalculado,
    });
  }

  private _limpiarImpuestos(indexFormulario: number) {
    const impuestos = this._obtenerImpuestoFormulario(indexFormulario);
    const impuestoDetalle = this._obtenerDetalleFormulario(indexFormulario);
    this.form.get('impuesto_operado')?.setValue(0);
    impuestoDetalle.get('impuesto_operado')?.setValue(0);
    impuestoDetalle.get('impuesto')?.setValue(0);
    impuestoDetalle.get('impuesto_retencion')?.setValue(0);
    impuestoDetalle.get('base_impuesto')?.setValue(0);
    impuestoDetalle.get('total_bruto')?.setValue(0);
    impuestos.clear();
  }

  private _actualizarFormulario() {
    let total = this.form.get('total')?.value;
    let subtotal = this.form.get('subtotal')?.value;
    let impuestoOperado = this.form.get('impuesto_operado')?.value;
    let baseImpuesto = this.form.get('base_impuesto')?.value;
    let totalCantidad = this.form.get('totalCantidad')?.value;
    let totalBruto = this.form.get('total_bruto')?.value;
    let impuesto = this.form.get('impuesto')?.value;
    let impuestoRetencion = this.form.get('impuesto_retencion')?.value;
    let descuento = this.form.get('descuento')?.value;

    total += this._operaciones.sumarTotal(this.detalles.value);
    const { creditos, debitos } = this._operaciones.sumarTotalCuenta(
      this.detalles.value,
    );

    this._actualizarAcumuladorDebitosCreditos(creditos, debitos);

    descuento += this._operaciones.sumarTotales(
      this.detalles.value,
      'descuento',
    );
    subtotal += this._operaciones.sumarSubtotal(this.detalles.value);
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

    this.form.patchValue({
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

  private _reiniciarSelectorCuenta(indexFormulario: number) {
    this.detalles.controls[indexFormulario].patchValue({
      cuenta: null,
      cuenta_codigo: null,
      cuenta_nombre: null,
    });

    // this.changeDetectorRef.detectChanges();
  }

  poblarDocumento(documentoFactura: DocumentoFacturaRespuesta) {
    this.form.patchValue({
      contacto: documentoFactura.contacto_id,
      contactoNombre: documentoFactura.contacto_nombre_corto,
      fecha: documentoFactura.fecha,
      fecha_vence: documentoFactura.fecha_vence,
      metodo_pago: documentoFactura.metodo_pago_id,
      metodo_pago_nombre: documentoFactura.metodo_pago_nombre,
      forma_pago: documentoFactura.forma_pago_id,
      forma_pago_nombre: documentoFactura.forma_pago_nombre,
      orden_compra: documentoFactura.orden_compra,
      comentario: documentoFactura.comentario,
      plazo_pago: documentoFactura.plazo_pago_id,
      numero: documentoFactura.numero,
      cue: documentoFactura.cue,
      referencia_cue: documentoFactura.referencia_cue,
      referencia_numero: documentoFactura.referencia_numero,
      referencia_prefijo: documentoFactura.referencia_prefijo,
      grupo_contabilidad: documentoFactura.grupo_contabilidad_id,
      almacen: documentoFactura.almacen_id,
      almacen_nombre: documentoFactura.almacen_nombre,
      sede: documentoFactura.sede,
      asesor: documentoFactura.asesor,
      resolucion: documentoFactura.resolucion_id,
      resolucion_numero: documentoFactura.resolucion_numero,
    });
  }

  poblarDocumentoDetalle(documentoDetalle: DocumentoFacturaDetalleRespuesta[]) {
    documentoDetalle.forEach((detalle, indexFormulario) => {
      const documentoDetalleGrupo = this._formBuilder.group({
        cuenta: [detalle.cuenta],
        cuenta_codigo: [detalle.cuenta_codigo],
        cuenta_nombre: [detalle.cuenta_nombre],
        item: [detalle.item],
        item_nombre: [detalle.item_nombre],
        cantidad: [
          detalle.cantidad,
          [
            validarPrecio(),
            Validators.min(1),
            Validators.pattern('^[0-9]+(\\.[0-9]{1,})?$'),
          ],
        ],
        precio: [
          detalle.precio,
          [
            validarPrecio(),
            Validators.min(0.1),
            Validators.pattern('^[0-9]+(\\.[0-9]{1,})?$'),
          ],
        ],
        porcentaje_descuento: [
          detalle.porcentaje_descuento,
          [
            validarDescuento(),
            Validators.min(0),
            Validators.max(100),
            Validators.pattern('^[0-9]+(\\.[0-9]{1,})?$'),
          ],
        ],
        descuento: [detalle.descuento],
        subtotal: [detalle.subtotal],
        total_bruto: [detalle.total_bruto],
        total: [detalle.total],
        neto: [0],
        base_impuesto: [detalle.base_impuesto],
        impuesto: [detalle.impuesto],
        impuesto_operado: [detalle.impuesto_operado],
        impuesto_retencion: [detalle.impuesto_retencion],
        impuestos: this._formBuilder.array([]),
        impuestos_eliminados: this._formBuilder.array([]),
        id: [detalle.id],
        tipo_registro: [detalle.tipo_registro],
        grupo: detalle.grupo_id,
        naturaleza: detalle.naturaleza,
        base: detalle.base,
        almacen: detalle.almacen_id,
        almacen_nombre: detalle.almacen_nombre,
        contacto: detalle.contacto_id,
        contacto_nombre: detalle.contacto_nombre_corto,
      });

      this.detalles.push(documentoDetalleGrupo);
      const impuestosAdaptados = detalle.impuestos.map((impuesto) =>
        this._adapterService.adaptarImpuestoDesdeConsultaDetalle(impuesto),
      );

      this._agregarCampoImpuestoACache(indexFormulario);
      this._actualizarImpuestoItem(impuestosAdaptados, indexFormulario);
    });

    this._limpiarImpuestosAcumulados();
    this._limpiarFormularioTotales();
    this._actualizarFormulario();
  }

  cargarDocumentoReferencia(documentoFactura: DocumentoFacturaRespuesta) {
    if (this.mostrarDocumentoReferencia()) {
      this.form.patchValue({
        documento_referencia: documentoFactura.documento_referencia_id,
        documento_referencia_numero:
          documentoFactura.documento_referencia_numero,
      });
    }
  }

  cargarPagos(documentoFactura: DocumentoFacturaRespuesta) {
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

  // acumulador de impuestos
  private _agregarNuevoEspacio() {
    this.impuestoCache.push({});
  }

  // metodos formulario
  get detalles(): FormArray {
    return this.form.get('detalles') as FormArray;
  }

  get detallesEliminados(): FormArray {
    return this.form.get('detalles_eliminados') as FormArray;
  }

  get pagos() {
    return this.form.get('pagos') as FormArray;
  }

  get totalAfectado() {
    return this.form.get('afectado') as FormControl;
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

  get form(): FormGroup {
    return this.formSubject.value;
  }

  // -----------------------------------------------------------------------

  validarFecha(control: AbstractControl) {
    const fecha = control.get('fecha')?.value;
    const fecha_vence = control.get('fecha_vence')?.value;

    if (fecha > fecha_vence) {
      control.get('fecha')?.setErrors({ fechaSuperiorNoValida: true });
    } else {
      if (control.get('fecha_vence')?.getError('fechaVenceInferiorNoValida')) {
        control.get('fecha_vence')?.setErrors(null);
      }
    }

    if (fecha_vence < fecha) {
      control
        .get('fecha_vence')
        ?.setErrors({ fechaVenceInferiorNoValida: true });
    } else {
      if (control.get('fecha')?.getError('fechaSuperiorNoValida')) {
        control.get('fecha')?.setErrors(null);
      }
    }
  }

  // es importante reiniciar el formulario en el ciclo onDestroy
  reiniciarFormulario(): void {
    this.impuestoCache = [];
    this.acumuladorDebitosCreditos.set({
      debitos: {
        total: 0,
        operado: -1,
      },
      creditos: {
        total: 0,
        operado: 1,
      },
    });
    this.acumuladorImpuestos.set({});
    this.formSubject.next(this.createForm());
  }

  /**
   * Convierte un objeto en un array de pares clave-valor.
   * @param obj El objeto que se desea transformar.
   * @returns Un array de pares clave-valor.
   */
  private _transformKeyValue(obj: {
    [key: string]: any;
  }): { key: string; value: any }[] {
    if (!obj || typeof obj !== 'object') {
      return [];
    }

    return Object.keys(obj).map((key) => ({
      key: key,
      value: obj[key],
    }));
  }
}
