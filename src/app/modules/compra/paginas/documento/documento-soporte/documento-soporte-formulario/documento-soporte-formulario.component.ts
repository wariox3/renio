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
import { RegistroAutocompletarGenContacto } from '@interfaces/comunes/autocompletar/general/gen-contacto.interface';
import { RegistroAutocompletarGenFormaPago } from '@interfaces/comunes/autocompletar/general/gen-forma-pago.interface';
import { RegistroAutocompletarGenMetodoPago } from '@interfaces/comunes/autocompletar/general/gen-metodo-pago.interface';
import { RegistroAutocompletarGenPlazoPago } from '@interfaces/comunes/autocompletar/general/gen-plazo-pago.interface';
import { CampoLista } from '@interfaces/comunes/componentes/buscar-avanzado/buscar-avanzado.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { Contacto } from '@interfaces/general/contacto';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import {
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, tap, throttleTime, zip } from 'rxjs';
import ContactoFormulario from '../../../../../general/paginas/contacto/contacto-formulario/contacto-formulario.component';
import { SeleccionarGrupoComponent } from '../../../../../../comun/componentes/factura/components/seleccionar-grupo/seleccionar-grupo.component';
import { SeleccionarAlmacenComponent } from '../../../../../../comun/componentes/factura/components/seleccionar-almacen/seleccionar-almacen.component';
import { RegistroAutocompletarInvAlmacen } from '@interfaces/comunes/autocompletar/inventario/inv-almacen.interface';
import { DocumentoSoporteInformacionExtraComponent } from '../documento-soporte-informacion-extra/documento-soporte-informacion-extra.component';
import { SeleccionarResolucionComponent } from '../../../../../../comun/componentes/selectores/seleccionar-resolucion/seleccionar-resolucion.component';
@Component({
  selector: 'app-documento-soporte-formulario',
  standalone: true,
  templateUrl: './documento-soporte-formulario.component.html',
  styleUrls: ['./documento-soporte-formulario.component.scss'],
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
    NgSelectModule,
    SeleccionarGrupoComponent,
    SeleccionarAlmacenComponent,
    DocumentoSoporteInformacionExtraComponent,
    SeleccionarResolucionComponent,
  ],
})
export default class FacturaDetalleComponent
  extends General
  implements OnInit, OnDestroy
{
  private _formularioFacturaService = inject(FormularioFacturaService);
  private _generalService = inject(GeneralService);

  public modoEdicion = this._formularioFacturaService.modoEdicion;
  public formaPagoLista: RegistroAutocompletarGenFormaPago[] = [];
  public acumuladorImpuesto =
    this._formularioFacturaService.acumuladorImpuestos;
  public estadoAprobado = this._formularioFacturaService.estadoAprobado;
  public mostrarDocumentoReferencia =
    this._formularioFacturaService.mostrarDocumentoReferencia;
  public formularioFactura = this._formularioFacturaService.form;

  informacionFormulario: any;
  active: Number;
  totalCantidad: number = 0;
  totalDescuento: number = 0;
  totalImpuestos: number = 0;
  totalImpuestosOperados: number = 0;
  totalBase: number = 0;
  totalGeneral: number = 0;
  subtotalGeneral: number = 0;
  totalNetoGeneral: number = 0;
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
  arrMovimientosClientes: any[] = [];
  arrMetodosPago: any[] = [];
  arrPlazoPago: any[] = [];
  arrDetallesEliminado: number[] = [];
  arrImpuestosEliminado: number[] = [];
  dataUrl: any;
  plazo_pago_dias: any = 0;
  visualizarCampoDocumentoReferencia = false;
  @ViewChild('btnGuardar', { static: true }) btnGuardar: HTMLButtonElement;
  theme_value = localStorage.getItem('kt_theme_mode_value');

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
      this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarGenFormaPago>(
        {
          modelo: 'GenFormaPago',
          serializador: 'ListaAutocompletar',
          ordenamientos: ['id'],
        },
      ),
    ).subscribe((respuesta: any) => {
      this.arrMetodosPago = respuesta[0].registros;
      this.arrPlazoPago = respuesta[1].registros;
      this.formaPagoLista = respuesta[2].registros;
      this._sugerirPrimerValorFormaPago();
      this.changeDetectorRef.detectChanges();
    });
  }

  get detalles() {
    return this.formularioFactura.get('detalles') as FormArray;
  }

  onSeleccionarGrupoChange(id: number) {
    this.formularioFactura.get('grupo_contabilidad')?.setValue(id);
  }

  recibirAlmacenSeleccionado(almacen: RegistroAutocompletarInvAlmacen) {
    this.formularioFactura.get('almacen')?.setValue(almacen.almacen_id);
    this.formularioFactura
      .get('almacen_nombre')
      ?.setValue(almacen.almacen_nombre);
  }

  recibirAlmacenVacio() {
    this.formularioFactura.get('almacen')?.setValue(null);
    this.formularioFactura.get('almacen_nombre')?.setValue('');
  }

  formSubmit() {
    if (this.formularioFactura.valid) {
      if (this.detalle == 0) {
        if (this.validarCamposDetalles() === false) {
          this.facturaService
            .guardarFactura({
              ...this.formularioFactura.value,
              ...{
                numero: null,
                documento_tipo: 11,
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
      } else {
        if (this.validarCamposDetalles() === false) {
          this._formularioFacturaService.submitActualizarFactura(
            'compra',
            this.detalle,
            this.parametrosUrl,
          );
        }
      }
    } else {
      this.formularioFactura.markAllAsTouched();
      this.validarCamposDetalles();
    }
  }

  validarCamposDetalles() {
    let errores = false;
    Object.values(this.detalles.controls).find((control: any) => {
      if (control.get('item').value === null) {
        control.markAsTouched(); // Marcar el control como 'touched'
        control.markAsDirty();
        errores = true;
        this.detalles.markAllAsTouched();
        this.detalles.markAsDirty();
        this.changeDetectorRef.detectChanges();
        this.alertaService.mensajeError(
          'Error en formulario filtros',
          'contiene campos vacios',
        );
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
      impuesto_operado: [0],
      impuestos: this.formBuilder.array([]),
      impuestos_eliminados: this.formBuilder.array([]),
      id: [null],
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
      this.formularioFactura.get(campo)?.setValue(dato.id);
      this.formularioFactura.get('contactoNombre')?.setValue(dato.nombre_corto);
    }
    if (campo === 'documento_referencia') {
      this.formularioFactura.get(campo)?.setValue(dato.id);
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
    //limpiar impuesto
    const detalleFormGroup = this.detalles.at(index) as FormGroup;
    const arrDetalleImpuestos = detalleFormGroup.get('impuestos') as FormArray;
    arrDetalleImpuestos.clear();
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
        impuesto['impuesto_operacion'] = impuesto['impuesto_operacion'];
        this.agregarImpuesto(impuesto, index, 'agregar');
      });
    }
    this.calcularTotales();
    this.formularioFactura.markAsTouched();
    this.formularioFactura.markAsDirty();
    this.changeDetectorRef.detectChanges();
  }

  calcularTotales() {
    this.totalDescuento = 0;
    this.totalImpuestos = 0;
    this.totalImpuestosOperados = 0;
    this.totalBase = 0;
    this.totalGeneral = 0;
    this.subtotalGeneral = 0;
    this.totalNetoGeneral = 0;
    this.totalCantidad = 0;
    let totalBaseImpuesto = 0;

    const detallesArray = this.formularioFactura.get('detalles') as FormArray;
    detallesArray.controls.forEach((detalleControl) => {
      const cantidad = detalleControl.get('cantidad')?.value || 0;

      const precio = detalleControl.get('precio')?.value || 0;
      const porcentajeDescuento =
        detalleControl.get('porcentaje_descuento')?.value || 0;
      let subtotal = cantidad * precio;
      let descuento = (porcentajeDescuento * subtotal) / 100;
      let subtotalFinal = subtotal - descuento;

      const impuestos = detalleControl.get('impuestos')?.value || [];
      impuestos.forEach((impuesto: any) => {
        this.totalImpuestos += impuesto.total;
        this.totalImpuestosOperados += impuesto.total_operado;
      });

      let neto = detalleControl.get('neto')?.value || 0;
      this.totalCantidad += parseInt(cantidad);
      this.totalDescuento += descuento;
      this.subtotalGeneral += subtotalFinal;
      this.totalNetoGeneral += neto;

      detalleControl.get('subtotal')?.patchValue(subtotalFinal);
      detalleControl.get('neto')?.patchValue(neto);
      detalleControl.get('descuento')?.patchValue(descuento);
      totalBaseImpuesto += detalleControl.get('base_impuesto')?.value;
      this.totalBase += detalleControl.get('base_impuesto')?.value;
      this.changeDetectorRef.detectChanges();
    });

    // Redondear subtotalGeneral
    this.subtotalGeneral = this.redondear(this.subtotalGeneral, 2);

    totalBaseImpuesto = this.redondear(totalBaseImpuesto, 2);
    this.totalGeneral = this.redondear(
      this.subtotalGeneral + this.redondear(this.totalImpuestosOperados, 2),
      2,
    );

    this.formularioFactura.patchValue({
      base_impuesto: totalBaseImpuesto,
      impuesto: this.redondear(this.totalImpuestos, 2),
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
        if (
          impuestoEliminar &&
          impuestoEliminar.hasOwnProperty('total_operado')
        ) {
          const { total, nombre_extendido } = impuestoEliminar;
          // Busca el impuesto correspondiente en el acumuladorImpuestos por nombre_extendido.
          if (
            this.acumuladorImpuestos[nombre_extendido]?.total_operado != null
          ) {
            if (this.acumuladorImpuestos[nombre_extendido].total_operado > 0) {
              this.acumuladorImpuestos[nombre_extendido].total_operado -= total;
            } else {
              // Resta el total del impuesto eliminado del acumuladorImpuestos.
              this.acumuladorImpuestos[nombre_extendido].total_operado += total;
            }
            // Si el total del impuesto acumulado es menor o igual a 0 después de la resta, elimínalo del acumulador.
            if (
              this.acumuladorImpuestos[nombre_extendido].total_operado === 0
            ) {
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
    const valor = parseFloat(evento.target.value);

    if (evento.target.value !== '') {
      if (valor < 0) {
        detalleFormGroup.get(campo)?.patchValue(0);
      } else {
        const valorRedondeado = this.redondear(valor, 2);
        detalleFormGroup.get(campo)?.patchValue(valorRedondeado);
      }
    } else {
      detalleFormGroup.get(campo)?.patchValue(0);
    }

    const subtotal = detalleFormGroup.get('subtotal') as FormControl;
    const neto = detalleFormGroup.get('neto') as FormControl;
    const total = detalleFormGroup.get('total') as FormControl;
    const arrDetalleImpuestos = detalleFormGroup.get('impuestos') as FormArray;

    const base_impuesto = detalleFormGroup.get('base_impuesto') as FormControl;
    const detalleImpuesto = detalleFormGroup.get('impuesto') as FormControl;
    const detalleImpuestoOperado = detalleFormGroup.get(
      'impuesto_operado',
    ) as FormControl;

    let impuestoTotal = 0;
    let impuestoTotalOperado = 0;
    this.calcularTotales();

    let impuestoTemporales = arrDetalleImpuestos.value;
    arrDetalleImpuestos.clear();

    impuestoTemporales.forEach((impuesto: any) => {
      let baseImpuestoActualizar = this.redondear(
        (subtotal.value * impuesto.porcentaje_base) / 100,
        2,
      );
      let totalImpuesto = this.redondear(
        (((subtotal.value * impuesto.porcentaje) / 100) *
          impuesto.porcentaje_base) /
          100,
        2,
      );

      let totalImpuestoOperado = totalImpuesto * impuesto.impuesto_operacion;

      let impuestoFormGrup = this.formBuilder.group({
        id: [impuesto.impuesto_id ? impuesto.id : null],
        impuesto: [impuesto.impuesto_id ? impuesto.impuesto_id : impuesto.id],
        base: [baseImpuestoActualizar],
        porcentaje: [impuesto.porcentaje],
        total: [totalImpuesto],
        total_operado: [totalImpuestoOperado],
        nombre: [impuesto.nombre],
        nombre_extendido: [impuesto.nombre_extendido],
        impuesto_id: [impuesto.impuesto_id],
        impuesto_nombre_extendido: [impuesto.nombre_extendido],
        impuesto_nombre: [impuesto.nombre],
        impuesto_operacion: [impuesto.impuesto_operacion],
        porcentaje_base: [impuesto.porcentaje_base],
        impuesto_venta: [impuesto.impuesto_venta],
        impuesto_compra: [impuesto.impuesto_compra],
      });

      arrDetalleImpuestos.push(impuestoFormGrup);
      this.acumuladorImpuestos[impuesto.nombre_extendido].total +=
        totalImpuesto - impuesto.total;
      this.acumuladorImpuestos[impuesto.nombre_extendido].total_operado +=
        totalImpuestoOperado - impuesto.total_operado;
      impuestoTotal += totalImpuesto;
      impuestoTotalOperado += totalImpuestoOperado;
      base_impuesto.setValue(baseImpuestoActualizar);
    });

    this.changeDetectorRef.detectChanges();

    const subtotalValueRedondeado = this.redondear(subtotal.value, 2);
    const impuestoTotalRedondeado = this.redondear(impuestoTotal, 2);
    const impuestoTotalOperadoRedondeado = this.redondear(
      impuestoTotalOperado,
      2,
    );

    neto.patchValue(
      this.redondear(
        subtotalValueRedondeado + impuestoTotalOperadoRedondeado,
        2,
      ),
    );
    total.patchValue(
      this.redondear(
        subtotalValueRedondeado + impuestoTotalOperadoRedondeado,
        2,
      ),
    );
    detalleImpuesto.setValue(impuestoTotalRedondeado);
    detalleImpuestoOperado.setValue(impuestoTotalOperado);

    this.calcularTotales();
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
    const impuestoDetalleOperado = detalleFormGroup.get(
      'impuesto_operado',
    ) as FormControl;
    const arrDetalleImpuestos = detalleFormGroup.get('impuestos') as FormArray;
    let impuestoAcumuladoDetalle = 0;
    let impuestoOperadoAcumuladoDetalle = 0;
    impuesto = {
      ...impuesto,
      index,
    };
    let totalImpuestoOperado = impuesto.total_operado;
    let totalImpuesto = impuesto.total;
    if (accion == 'agregar') {
      totalImpuesto =
        (((subtotal.value * impuesto.impuesto_porcentaje) / 100) *
          impuesto.impuesto_porcentaje_base) /
        100;

      // Redondear el totalImpuesto
      totalImpuesto = this.redondear(totalImpuesto, 2);

      totalImpuestoOperado = totalImpuesto * impuesto.impuesto_operacion;
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
    let baseImpuestoRedondeada = this.redondear(baseImpuestoActualizar, 2);
    let impuestoFormGrup = this.formBuilder.group({
      id: [accion === 'actualizacion' ? impuesto.id : null], //id tabla intermedia entre documento y impuesto
      impuesto: [impuesto.impuesto_id ? impuesto.impuesto_id : impuesto.id], //id
      base: [baseImpuestoRedondeada],
      porcentaje: [impuesto.porcentaje],
      total: [totalImpuesto],
      total_operado: [totalImpuestoOperado],
      nombre: [impuesto.nombre],
      nombre_extendido: [impuesto.nombre_extendido],
      impuesto_id: [impuesto.impuesto_id],
      impuesto_nombre_extendido: [impuesto.nombre_extendido],
      impuesto_nombre: [impuesto.nombre],
      impuesto_operacion: [impuesto.impuesto_operacion],
      porcentaje_base: [impuesto.impuesto_porcentaje_base],
      impuesto_venta: [impuesto.impuesto_venta],
      impuesto_compra: [impuesto.impuesto_compra],
    });
    impuestoAcumuladoDetalle = impuestoDetalle.value + totalImpuesto;

    impuestoOperadoAcumuladoDetalle =
      impuestoDetalleOperado.value + totalImpuestoOperado;
    baseImpuesto.setValue(
      baseImpuestoRedondeada === null ? 0 : baseImpuestoRedondeada,
    );
    arrDetalleImpuestos.push(impuestoFormGrup);
    this.changeDetectorRef.detectChanges();

    if (!this.acumuladorImpuestos[impuesto.nombre_extendido]) {
      this.acumuladorImpuestos[impuesto.nombre_extendido] = {
        total: totalImpuesto,
        total_operado: totalImpuestoOperado,
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
        this.acumuladorImpuestos[impuesto.nombre_extendido].total_operado +=
          totalImpuestoOperado;
        this.acumuladorImpuestos[impuesto.nombre_extendido].data.push(impuesto);
      }
    }
    let netoTemporal = total.value;
    if (accion == 'actualizacion') {
      if (detalleFormGroup.value.impuestos.length == 1) {
        netoTemporal = subtotal.value;
        netoTemporal += totalImpuestoOperado;
      } else {
        netoTemporal = neto.value;
        netoTemporal += totalImpuestoOperado;
      }
    }

    if (netoTemporal == 0 || netoTemporal == null) {
      netoTemporal = subtotal.value + totalImpuestoOperado;
    }

    if (accion == 'agregar') {
      netoTemporal += totalImpuestoOperado;
    }

    netoTemporal = this.redondear(netoTemporal, 2);

    neto.patchValue(netoTemporal);
    total.patchValue(netoTemporal);
    this.calcularTotales();
    detalleFormGroup.patchValue({
      base_impuesto: baseImpuestoRedondeada,
      impuesto: impuestoAcumuladoDetalle,
      impuesto_operado: impuestoOperadoAcumuladoDetalle,
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
    const impuestoDetalleOperado = detalleFormGroup.get(
      'impuesto_operado',
    ) as FormControl;

    let nuevosImpuestos = arrDetalleImpuestos.value.filter(
      (item: any) => item.impuesto_id !== impuesto.impuesto_id,
    );

    let totalImpuesto =
      (((subtotal.value * impuesto.porcentaje) / 100) *
        impuesto.porcentaje_base) /
      100;

    let totalImpuestoOperado = 0;

    // Redondear el totalImpuesto
    totalImpuesto = this.redondear(totalImpuesto, 2);

    totalImpuestoOperado = totalImpuesto * impuesto.impuesto_operacion;

    // Limpiar el FormArray actual
    arrDetalleImpuestos.clear();

    if (nuevosImpuestos.length >= 1) {
      detalleFormGroup.patchValue({
        impuesto: impuestoDetalle.value - impuesto.total,
        impuesto_operado: impuestoDetalleOperado.value - impuesto.total_operado,
      });
    } else {
      detalleFormGroup.patchValue({
        base_impuesto: 0,
        impuesto: 0,
        impuesto_operado: 0,
      });
    }

    // Agregar los impuestos filtrados de nuevo al FormArray
    nuevosImpuestos.forEach((nuevoImpuesto: any) => {
      let totalImpuestoNuevo =
        (((subtotal.value * nuevoImpuesto.porcentaje) / 100) *
          nuevoImpuesto.porcentaje_base) /
        100;

      // Redondear el totalImpuestoNuevo
      totalImpuestoNuevo = this.redondear(totalImpuestoNuevo, 2);

      let totalImpuestoOperado =
        totalImpuestoNuevo * nuevoImpuesto.impuesto_operacion;

      let baseImpuestoActualizar =
        (subtotal.value * nuevoImpuesto.porcentaje_base) / 100;

      const nuevoDetalle = this.formBuilder.group({
        id: [nuevoImpuesto.id],
        impuesto: [nuevoImpuesto.impuesto],
        base: [this.redondear(baseImpuestoActualizar, 2)],
        porcentaje: [nuevoImpuesto.porcentaje],
        total: [totalImpuestoNuevo],
        total_operado: [totalImpuestoOperado],
        nombre: [nuevoImpuesto.nombre],
        nombre_extendido: [nuevoImpuesto.nombre_extendido],
        impuesto_id: [nuevoImpuesto.impuesto_id],
        impuesto_nombre_extendido: [nuevoImpuesto.nombre_extendido],
        impuesto_nombre: [nuevoImpuesto.nombre],
        impuesto_operacion: [nuevoImpuesto.impuesto_operacion],
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
      this.acumuladorImpuestos[impuesto.nombre_extendido].total_operado -=
        impuesto.total_operado;
    }

    let netoTemporal = neto.value;

    if (netoTemporal > 0) {
      netoTemporal = this.redondear(netoTemporal - totalImpuestoOperado, 2);
    }

    neto.patchValue(netoTemporal);
    total.patchValue(netoTemporal);

    this.calcularTotales();
    this.changeDetectorRef.detectChanges();
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioFactura?.markAsDirty();
    this.formularioFactura?.markAsTouched();
    if (campo === 'contacto' || campo === 'contactoNuevoModal') {
      this.formularioFactura.get(campo)?.setValue(dato.contacto_id);
      this.formularioFactura
        .get('contactoNombre')
        ?.setValue(dato.contacto_nombre_corto);

      if (campo === 'contactoNuevoModal') {
        this.formularioFactura.get(campo)?.setValue(dato.id);
        this.formularioFactura
          .get('contactoNombre')
          ?.setValue(dato.nombre_corto);
      }

      this.formularioFactura
        .get('plazo_pago')
        ?.setValue(dato.plazo_pago_proveedor_id);
      if (dato.plazo_pago_proveedor_dias > 0) {
        this.plazo_pago_dias = dato.plazo_pago_proveedor_dias;
        const diasNumero = parseInt(this.plazo_pago_dias, 10) + 1;
        let fechaInicio = this.formularioFactura.get('fecha')?.value;
        const fechaActual = new Date(fechaInicio);
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
        this.parametrosUrl?.documento_clase == 6 ||
        this.parametrosUrl?.documento_clase == 7
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
    let arrFiltros = {
      filtros: [
        {
          propiedad: 'numero__icontains',
          valor1: `${event?.target.value}`,
        },
      ],
      limite: 5,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'Documento',
    };

    this.httpService
      .post<any>('general/documento/referencia/', {
        ...arrFiltros,
        contacto_id: this.formularioFactura.get('contacto')?.value,
        documento_clase_id: 1,
      })
      .pipe(
        throttleTime(600, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrMovimientosClientes = respuesta;
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
              impuesto: [detalle.impuesto],
              impuesto_operado: [detalle.impuesto_operado],
              impuestos: this.formBuilder.array([]),
              impuestos_eliminados: this.formBuilder.array([]),
              id: [detalle.id],
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

  redondear(valor: number, decimales: number): number {
    const factor = Math.pow(10, decimales);
    return Math.round(valor * factor) / factor;
  }

  private _sugerirPrimerValorFormaPago() {
    if (!this.detalle) {
      if (this.formaPagoLista.length > 0) {
        this.formularioFactura.patchValue({
          forma_pago: this.formaPagoLista?.[0].forma_pago_id,
        });
      }
    }
  }
}
