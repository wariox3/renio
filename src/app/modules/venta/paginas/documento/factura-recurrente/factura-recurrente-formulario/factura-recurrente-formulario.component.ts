import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { CuentaBancoComponent } from '@comun/componentes/cuenta-banco/cuenta-banco.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { FormularioProductosComponent } from '@comun/componentes/factura/components/formulario-productos/formulario-productos.component';
import { AnimacionFadeInOutDirective } from '@comun/directive/animacion-fade-in-out.directive';
import { SoloNumerosDirective } from '@comun/directive/solo-numeros.directive';
import { FormularioFacturaService } from '@comun/services/factura/formulario-factura.service';
import { GeneralService } from '@comun/services/general.service';
import { HttpService } from '@comun/services/http.service';
import { validarPrecio } from '@comun/validaciones/validar-precio.validator';
import { RegistroAutocompletarGenSede } from '@interfaces/comunes/autocompletar/general/gen-sede.interface';
import { CampoLista } from '@interfaces/comunes/componentes/buscar-avanzado/buscar-avanzado.interface';
import {
  AcumuladorImpuestos,
  PagoFormulario,
} from '@interfaces/comunes/factura/factura.interface';
import { Contacto } from '@interfaces/general/contacto';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import ContactoFormulario from '@modulos/general/paginas/contacto/contacto-formulario/contacto-formulario.component';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import {
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, catchError, of, tap, throttleTime, zip } from 'rxjs';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { RegistroAutocompletarGenAsesor } from '@interfaces/comunes/autocompletar/general/gen-asesor.interface';
import { RegistroAutocompletarGenMetodoPago } from '@interfaces/comunes/autocompletar/general/gen-metodo-pago.interface';
import { RegistroAutocompletarGenPlazoPago } from '@interfaces/comunes/autocompletar/general/gen-plazo-pago.interface';
import { RegistroAutocompletarGenContacto } from '@interfaces/comunes/autocompletar/general/gen-contacto.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';

@Component({
  selector: 'app-factura-formulario',
  standalone: true,
  templateUrl: './factura-recurrente-formulario.component.html',
  styleUrls: ['./factura-recurrente-formulario.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbDropdownModule,
    NgbNavModule,
    BuscarAvanzadoComponent,
    SoloNumerosDirective,
    CardComponent,
    AnimacionFadeInOutDirective,
    ContactoFormulario,
    CuentaBancoComponent,
    FormularioProductosComponent,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
  ],
})
export default class FacturaRecurrenteFormularioComponent
  extends General
  implements OnInit, OnDestroy
{
  private _formularioFacturaService = inject(FormularioFacturaService);
  private readonly _generalService = inject(GeneralService);

  public modoEdicion = this._formularioFacturaService.modoEdicion;
  public acumuladorImpuesto =
    this._formularioFacturaService.acumuladorImpuestos;
  public estadoAprobado = this._formularioFacturaService.estadoAprobado;
  public formularioFactura = this._formularioFacturaService.form;

  informacionFormulario: any;
  active: Number;
  totalCantidad: number = 0;
  totalDescuento: number = 0;
  totalImpuestos: number = 0;
  totalBase: number = 0;
  subtotalGeneral: number = 0;
  totalNetoGeneral: number = 0;
  informacionDetalle: any = {
    contacto_id: '',
    porcetanje_descuento: '',
    descuento: '',
    documento_tipo_id: '',
    fecha: '',
    // fecha_vence: '',
    id: null,
    impuesto: 0,
    base_impuesto: 0,
    numero: null,
    subtotal: 0,
    total: 0,
    total_bruto: 0,
    metodo_pago: null,
    detalles: [],
    pagos: [],
  };
  acumuladorImpuestos: any[] = [];
  arrMovimientosClientes: any[] = [];
  arrMetodosPago: any[] = [];
  arrPlazoPago: any[] = [];
  arrAsesor: any[] = [];
  arrSede: any[] = [];
  arrDetallesEliminado: number[] = [];
  arrImpuestosEliminado: number[] = [];
  arrPagosEliminado: number[] = [];
  dataUrl: any;
  plazo_pago_dias: any = 0;
  visualizarCampoDocumentoReferencia = false;
  btnGuardarDisabled = false;
  requiereAsesor = false;
  requiereSede = false;
  theme_value = localStorage.getItem('kt_theme_mode_value');
  camposBuscarAvanzado = [
    'id',
    'identificacion_abreviatura',
    'numero_identificacion',
    'nombre_corto',
  ];
  public campoLista: CampoLista[] = [
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
      propiedad: 'cliente',
      valor1: 'True',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private facturaService: FacturaService,
    private empresaService: EmpresaService,
    private modalService: NgbModal,
  ) {
    super();
  }

  ngOnInit() {
    this.consultarInformacion();
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
      this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarGenAsesor>(
        {
          modelo: 'GenAsesor',
          serializador: 'ListaAutocompletar',
        },
      ),
      this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarGenSede>(
        {
          modelo: 'GenSede',
          serializador: 'ListaAutocompletar',
        },
      ),
      this.empresaService.obtenerConfiguracionEmpresa(1),
    ).subscribe((respuesta) => {
      this.arrMetodosPago = respuesta[0].registros;
      this.arrPlazoPago = respuesta[1].registros;
      this.arrAsesor = respuesta[2].registros;
      this.arrSede = respuesta[3].registros;
      this.requiereAsesor = respuesta[4].venta_asesor;
      this.requiereSede = respuesta[4].venta_sede;

      if (!this.detalle) {
        this._initSugerencias();
      }

      this.changeDetectorRef.detectChanges();
    });
  }

  get detalles() {
    return this.formularioFactura.get('detalles') as FormArray;
  }

  get pagos() {
    return this.formularioFactura.get('pagos') as FormArray;
  }

  formSubmit() {
    this.btnGuardarDisabled = true;
    this.changeDetectorRef.detectChanges();
    let errores = false;
    if (this.formularioFactura.valid) {
      if (this.pagos.length > 0) {
        this.pagos.controls.map((pago) => {
          if (pago.get('pago')?.value === 0) {
            this.alertaService.mensajeError(
              'Error',
              'Los pagos agregados no puede tener pagos en cero ',
            );
            errores = true;
            this.btnGuardarDisabled = false;
            return null;
          }
          this.btnGuardarDisabled = false;
          this.changeDetectorRef.detectChanges();
          return null;
        });
        if (this.totalAfectado > this.totalGeneral) {
          this.alertaService.mensajeError(
            'Error',
            'Los pagos agregados son superiores al total de la factura',
          );
          this.btnGuardarDisabled = false;
          this.changeDetectorRef.detectChanges();
          return null;
        }
      }
      if (!errores) {
        if (this.detalle == 0) {
          if (this.validarCamposDetalles() === false) {
            this.facturaService
              .guardarFactura({
                ...this.formularioFactura.value,
                ...{
                  numero: null,
                  documento_tipo: 16,
                },
              })
              .pipe(
                tap((respuesta) => {
                  this.router.navigate(
                    [`venta/documento/detalle/${respuesta.documento.id}`],
                    {
                      queryParams: {
                        ...this.parametrosUrl,
                      },
                    },
                  );
                }),
                catchError(() => {
                  this.btnGuardarDisabled = false;
                  this.changeDetectorRef.detectChanges();
                  return of(null);
                }),
              )
              .subscribe();
          } else {
            this.btnGuardarDisabled = false;
            this.changeDetectorRef.detectChanges();
          }
        } else {
          if (this.validarCamposDetalles() === false) {
            this._formularioFacturaService.submitActualizarFactura(
              'venta',
              this.detalle,
              this.parametrosUrl,
            );
          }
        }
      }
    } else {
      this.formularioFactura.markAllAsTouched();
      this.pagos.markAllAsTouched();
      setTimeout(() => {
        this.btnGuardarDisabled = false;
        this.changeDetectorRef.detectChanges();
      }, 50);
      this.changeDetectorRef.detectChanges();
      this.validarCamposDetalles();
    }

    this.changeDetectorRef.detectChanges();
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
          'Error en detalles',
          'contiene campos vacios',
        );
      }
      if (control.get('precio').value == 0) {
        control.markAsTouched(); // Marcar el control como 'touched'
        control.markAsDirty();
        errores = true;
        this.detalles.markAllAsTouched();
        this.detalles.markAsDirty();
        this.changeDetectorRef.detectChanges();
        this.alertaService.mensajeError(
          'Error en detalles',
          'contiene campos en cero',
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
      precio: [0, Validators.compose([this.validatePrecio])],
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
    //validar si tiene impuestos y agregarlos
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

  calcularTotales() {}

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

    let impuestoTotal = 0;
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

      let impuestoFormGrup = this.formBuilder.group({
        id: [impuesto.impuesto_id ? impuesto.id : null],
        impuesto: [impuesto.impuesto_id ? impuesto.impuesto_id : impuesto.id],
        base: [baseImpuestoActualizar],
        porcentaje: [impuesto.porcentaje],
        total: [totalImpuesto],
        total_operado: [totalImpuesto],
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
    });

    this.changeDetectorRef.detectChanges();

    const subtotalValueRedondeado = this.redondear(subtotal.value, 2);
    const impuestoTotalRedondeado = this.redondear(impuestoTotal, 2);

    neto.patchValue(
      this.redondear(subtotalValueRedondeado + impuestoTotalRedondeado, 2),
    );
    total.patchValue(
      this.redondear(subtotalValueRedondeado + impuestoTotalRedondeado, 2),
    );
    detalleImpuesto.setValue(impuestoTotalRedondeado);

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

      // Redondear el totalImpuesto
      totalImpuesto = this.redondear(totalImpuesto, 2);
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
      total_operado: [totalImpuesto],
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
      baseImpuestoRedondeada === null ? 0 : baseImpuestoRedondeada,
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

    netoTemporal = this.redondear(netoTemporal, 2);

    neto.patchValue(netoTemporal);
    total.patchValue(netoTemporal);
    this.calcularTotales();
    detalleFormGroup.patchValue({
      base_impuesto: baseImpuestoRedondeada,
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

    // Redondear el totalImpuesto
    totalImpuesto = this.redondear(totalImpuesto, 2);

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

      // Redondear el totalImpuestoNuevo
      totalImpuestoNuevo = this.redondear(totalImpuestoNuevo, 2);

      let baseImpuestoActualizar =
        (subtotal.value * nuevoImpuesto.porcentaje_base) / 100;

      const nuevoDetalle = this.formBuilder.group({
        id: [nuevoImpuesto.id],
        impuesto: [nuevoImpuesto.impuesto],
        base: [this.redondear(baseImpuestoActualizar, 2)],
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
      netoTemporal = this.redondear(netoTemporal - totalImpuesto, 2);
    }

    neto.patchValue(netoTemporal);
    total.patchValue(netoTemporal);

    this.calcularTotales();
    this.changeDetectorRef.detectChanges();
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioFactura?.markAsDirty();
    this.formularioFactura?.markAsTouched();
    if (campo === 'contacto') {
      if (dato.contacto_id && dato.contacto_nombre_corto) {
        this.formularioFactura.get(campo)?.setValue(dato.contacto_id);
        this.formularioFactura
          .get('contactoNombre')
          ?.setValue(dato.contacto_nombre_corto);
      }
      if (dato.id && dato.nombre_corto) {
        this.formularioFactura.get(campo)?.setValue(dato.id);
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
        // this.formularioFactura.get('fecha_vence')?.setValue(fechaVencimiento);
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
          propiedad: 'cliente',
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
          // fecha_vence: respuesta.documento.fecha_vence,
          metodo_pago: respuesta.documento.metodo_pago_id,
          metodo_pago_nombre: respuesta.documento.metodo_pago_nombre,
          orden_compra: respuesta.documento.orden_compra,
          comentario: respuesta.documento.comentario,
          plazo_pago: respuesta.documento.plazo_pago_id,
          asesor: respuesta.documento.asesor,
          asesor_nombre_corto: respuesta.documento.asesor_nombre_corto,
          sede: respuesta.documento.sede,
          sede_nombre: respuesta.documento.sede_nombre,
        });

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
            });
            this.detalles.push(detalleFormGroup);

            detalle.impuestos.forEach((impuesto: any) => {
              this.agregarImpuesto(impuesto, indexDetalle, 'actualizacion');
            });
          },
        );
        respuesta.documento.pagos.forEach((pago: any, indexPago: number) => {
          const pagoFormGroup = this.formBuilder.group({
            id: pago.id,
            cuenta_banco: pago.cuenta_banco_id,
            cuenta_banco_nombre: pago.cuenta_banco_nombre,
            pago: pago.pago,
          });
          this.pagos.push(pagoFormGroup);
        });
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
    // this.formularioFactura.get('fecha_vence')?.setValue(fechaVencimiento);
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
    // this.formularioFactura.get('fecha_vence')?.setValue(fechaVencimiento);
  }

  validatePrecio(control: any) {
    if (control.value === 0) {
      return { valorCero: true };
    }
    return null;
  }

  abrirModalContactoNuevo(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
  }

  cerrarModal(contacto: Contacto) {
    this.modificarCampoFormulario('contacto', contacto);
    this.modalService.dismissAll();
  }

  // mover
  // TODO: Eliminar
  redondear(valor: number, decimales: number): number {
    const factor = Math.pow(10, decimales);
    return Math.round(valor * factor) / factor;
  }

  // TODO: Preguntar sobre esta logica (se requiere en todos los componentes?)
  agregarPago() {
    if (this.detalles.length > 0) {
      const pagoFormGroup = this.formBuilder.group({
        cuenta_banco: [null, Validators.compose([Validators.required])],
        cuenta_banco_nombre: [null],
        pago: [
          0,
          [
            validarPrecio(),
            Validators.min(1),
            Validators.pattern('^[0-9]+(\\.[0-9]{1,})?$'),
          ],
        ],
        pagos_eliminados: this.formBuilder.array([]),
        id: [null],
      });
      this.pagos.push(pagoFormGroup);
      this.pagos?.markAllAsTouched();
      this.changeDetectorRef.detectChanges();
    } else {
      this.alertaService.mensajeError('Error', 'Se requieren agragar detalles');
    }
  }

  // TODO: Preguntar sobre esta logica (se requiere en todos los componentes?)
  eliminarPago(index: number, id: number | null) {
    if (id !== null) {
      this.pagosEliminados.value.push(id);
    }

    this.pagos.removeAt(index);
    this._limpiarTotalAfectado();
    this._calcularTotalPagos();
    this.changeDetectorRef.detectChanges();
  }

  // TODO: Preguntar sobre esta logica (se requiere en todos los componentes?)
  agregarPagoSeleccionado(item: any, index: number) {
    this.pagos.controls[index].patchValue({
      cuenta_banco: item.cuenta_banco_id,
      cuenta_banco_nombre: item.cuenta_banco_nombre,
    });
    const pagoFormGroup = this.pagos.at(index) as FormGroup;

    this.formularioFactura.markAsTouched();
    this.formularioFactura.markAsDirty();
    this.changeDetectorRef.detectChanges();
  }

  // TODO: Preguntar sobre esta logica (se requiere en todos los componentes?)
  actualizarDetallePago(index: number, campo: string, evento: any) {
    const pagoFormGroup = this.pagos.at(index) as FormGroup;
    const valor = parseFloat(evento.target.value);

    if (evento.target.value !== '') {
      if (valor < 0) {
        pagoFormGroup.get(campo)?.patchValue(0);
      } else {
        const valorRedondeado = this.redondear(valor, 2);
        if (valorRedondeado <= this.totalGeneral.value) {
          pagoFormGroup.get(campo)?.patchValue(valorRedondeado);
        } else {
          this.alertaService.mensajeError(
            'Error',
            'El valor ingresado del pago es mayor al total general',
          );
        }
      }
    } else {
      pagoFormGroup.get(campo)?.patchValue(0);
    }

    this._limpiarTotalAfectado();
    this._calcularTotalPagos();
    this.changeDetectorRef.detectChanges();

    if (this.totalAfectado.value > this.totalGeneral.value) {
      this.alertaService.mensajeError(
        'Error',
        'Los pagos agregados son superiores al total de la factura',
      );

      pagoFormGroup.get('pago')?.setErrors({ valorCero: true });
      this.changeDetectorRef.detectChanges();
    }
  }

  private _calcularTotalPagos() {
    let total: number = 0;
    this.pagos.value.forEach((pagoRealizado: PagoFormulario) => {
      total += pagoRealizado.pago;
    });

    this.totalAfectado.setValue(total);
  }

  private _limpiarTotalAfectado() {
    this.totalAfectado.setValue(0);
  }

  get totalGeneral() {
    return this.formularioFactura.get('total') as FormControl;
  }

  get totalAfectado() {
    return this.formularioFactura.get('afectado') as FormControl;
  }

  get pagosEliminados() {
    return this.formularioFactura.get('pagos_eliminados') as FormArray;
  }

  private _initSugerencias() {
    this._sugerirSede(0);
  }

  private _sugerirSede(posicion: number) {
    if (this.arrSede.length > 0) {
      this.formularioFactura.patchValue({
        sede: this.arrSede?.[posicion].sede_id,
      });
    }
  }
}
