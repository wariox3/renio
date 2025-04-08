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
import { RegistroAutocompletarGenAsesor } from '@interfaces/comunes/autocompletar/general/gen-asesor.interface';
import { RegistroAutocompletarGenContacto } from '@interfaces/comunes/autocompletar/general/gen-contacto.interface';
import { RegistroAutocompletarGenMetodoPago } from '@interfaces/comunes/autocompletar/general/gen-metodo-pago.interface';
import { RegistroAutocompletarGenPlazoPago } from '@interfaces/comunes/autocompletar/general/gen-plazo-pago.interface';
import { RegistroAutocompletarGenSede } from '@interfaces/comunes/autocompletar/general/gen-sede.interface';
import { CampoLista } from '@interfaces/comunes/componentes/buscar-avanzado/buscar-avanzado.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import {
  AcumuladorImpuestos,
  DocumentoFacturaRespuesta,
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
import {
  asyncScheduler,
  BehaviorSubject,
  catchError,
  of,
  tap,
  throttleTime,
  zip,
} from 'rxjs';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { AlmacenesComponent } from '@comun/componentes/almacenes/almacenes.component';
import { RegistroAutocompletarInvAlmacen } from '@interfaces/comunes/autocompletar/inventario/inv-alamacen';

@Component({
  selector: 'app-factura-pos-formulario',
  standalone: true,
  templateUrl: './factura-pos-formulario.component.html',
  styleUrls: ['./factura-pos-formulario.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbNavModule,
    BuscarAvanzadoComponent,
    SoloNumerosDirective,
    CardComponent,
    AnimacionFadeInOutDirective,
    ContactoFormulario,
    CuentaBancoComponent,
    FormularioProductosComponent,
    NgbDropdownModule,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
    AlmacenesComponent,
  ],
})
export default class FacturaPosFormularioComponent
  extends General
  implements OnInit, OnDestroy
{
  private _formBuilder = inject(FormBuilder);
  private _facturaService = inject(FacturaService);
  private _httpService = inject(HttpService);
  private _empresaService = inject(EmpresaService);
  private _modalService = inject(NgbModal);
  private _formularioFacturaService = inject(FormularioFacturaService);
  private _generalService = inject(GeneralService);

  public active: Number;
  public dataUrl: any;
  public visualizarCampoDocumentoReferencia = false;
  public botonGuardarDeshabilitado$: BehaviorSubject<boolean>;
  public modoEdicion = this._formularioFacturaService.modoEdicion;
  public acumuladorImpuesto =
    this._formularioFacturaService.acumuladorImpuestos;
  public estadoAprobado = this._formularioFacturaService.estadoAprobado;
  public formularioFactura = this._formularioFacturaService.form;

  public plazo_pago_dias: any = 0;
  public arrMovimientosClientes: any[] = [];
  public arrMetodosPago: RegistroAutocompletarGenMetodoPago[] = [];
  public arrPlazoPago: RegistroAutocompletarGenPlazoPago[] = [];
  public arrAsesor: RegistroAutocompletarGenAsesor[] = [];
  public arrSede: RegistroAutocompletarGenSede[] = [];
  public arrAlmacenes: RegistroAutocompletarInvAlmacen[] = [];
  public requiereAsesor: boolean = false;
  public camposBuscarAvanzado = [
    'id',
    'identificacion_abreviatura',
    'numero_identificacion',
    'nombre_corto',
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
      propiedad: 'cliente',
      valor1: 'True',
    },
  ];

  public theme_value = localStorage.getItem('kt_theme_mode_value');

  constructor() {
    super();
    this.botonGuardarDeshabilitado$ = new BehaviorSubject<boolean>(false);
  }

  ngOnInit() {
    this._consultarInformacion().subscribe(() => {
      this._actualizarPlazoPago(
        this.formularioFactura.get('plazo_pago')?.value,
      );
      this.almacenSeleccionado(this.arrAlmacenes[0]);
      this.changeDetectorRef.detectChanges();
    });

    this.active = 1; // navigation tab

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

  private _actualizarPlazoPago(plazoPagoId: number) {
    this.arrPlazoPago.find((plazoPago) => {
      if (plazoPago.plazo_pago_id === plazoPagoId) {
        this.plazo_pago_dias = plazoPago.plazo_dias;
        this.cambiarFechaVence();
      }
    });
  }

  recibirDocumentoDetalleRespuesta(evento: DocumentoFacturaRespuesta) {
    this._actualizarPlazoPago(evento.plazo_pago_id);
  }

  get detalles() {
    return this.formularioFactura.get('detalles') as FormArray;
  }

  get pagos() {
    return this.formularioFactura.get('pagos') as FormArray;
  }

  enviarFormulario() {}

  private _esValidoValorPago(): boolean {
    for (let pago of this.pagos.controls) {
      if (pago.get('pago')?.value === 0) {
        this.alertaService.mensajeError(
          'Error',
          'Los pagos agregados no pueden tener pagos en cero',
        );
        return false; // Detiene la ejecución al encontrar un pago en cero
      }
    }

    return true;
  }

  private _esValidaLogicaDeFacturacion(): boolean {
    if (this.totalAfectado > this.totalGeneral) {
      this.alertaService.mensajeError(
        'Error',
        'Los pagos agregados son superiores al total de la factura',
      );

      return false;
    }

    return true;
  }

  private _formularioInvalido() {
    this.formularioFactura.markAllAsTouched();
    this.pagos.markAllAsTouched();
    this.botonGuardarDeshabilitado$.next(false);
    this.validarCamposDetalles();
  }

  // Enviar formulario
  formSubmit() {
    this.botonGuardarDeshabilitado$.next(true);

    if (!this.formularioFactura.valid) {
      this._formularioInvalido();
      return null;
    }

    if (this.pagos.length > 0) {
      const campoPagoEsValido =
        this._esValidoValorPago() && this._esValidaLogicaDeFacturacion();

      if (!campoPagoEsValido) {
        this.botonGuardarDeshabilitado$.next(false);
        return null;
      }
    }

    if (this.detalle !== 0) {
      this._actualizarFactura();
    } else {
      this._guardarFactura();
    }
  }

  private _actualizarFactura() {
    if (this.validarCamposDetalles() === false) {
      this._formularioFacturaService.submitActualizarFactura(
        'venta',
        this.detalle,
        this.parametrosUrl,
      );
    }
  }

  private _guardarFactura() {
    if (this.validarCamposDetalles() === false) {
      this._facturaService
        .guardarFactura({
          ...this.formularioFactura.value,
          ...{
            numero: null,
            documento_tipo: 24,
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
            this.botonGuardarDeshabilitado$.next(false);
            return of(null);
          }),
        )
        .subscribe();
    } else {
      this.botonGuardarDeshabilitado$.next(false);
    }
  }

  // TODO: mover a validaciones en caso de que sea una validacion custom
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

  // TODO: mover cuando se logre una solucion
  // TODO: Eliminar
  redondear(valor: number, decimales: number): number {
    const factor = Math.pow(10, decimales);
    return Math.round(valor * factor) / factor;
  }

  // TODO: Preguntar sobre esta logica (se requiere en todos los componentes?)
  agregarPago() {
    if (this.detalles.length > 0) {
      const pagoFormGroup = this._formBuilder.group({
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
        pagos_eliminados: this._formBuilder.array([]),
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

    this._httpService
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

  cambiarFechaVence() {
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

  abrirModalContactoNuevo(content: any) {
    this._modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
  }

  cerrarModal(contacto: Contacto) {
    this.modificarCampoFormulario('contacto', contacto);
    this._modalService.dismissAll();
  }

  private _convertirFecha(fecha: string) {
    const fechaString = fecha; // Obtener la fecha como string
    const [year, month, day] = fechaString.split('-').map(Number); // Dividir en año, mes, día
    const fechaFactura = new Date(year, month - 1, day); // Crear el objeto Date

    return fechaFactura;
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
        const diasNumero = parseInt(this.plazo_pago_dias, 10);
        const fechaActual = this._convertirFecha(
          this.formularioFactura.get('fecha')?.value,
        );

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
      } else {
        this.plazo_pago_dias = 0;
        this.formularioFactura
          .get('fecha_vence')
          ?.setValue(this.formularioFactura.get('fecha')?.value);
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

  almacenSeleccionado(almacen: any) {
    this.formularioFactura.patchValue({
      almacen: almacen.almacen_id,
      almacen_nombre: almacen.almacen_nombre,
    });
  }

  limpiarCampoAlmacen(item: any) {
    this.formularioFactura.patchValue({
      almacen: null,
      almacen_nombre: null,
    });
    this.changeDetectorRef.detectChanges();
  }

  private _consultarInformacion() {
    return zip(
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
      this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarInvAlmacen>(
        {
          limite: 1,
          modelo: 'InvAlmacen',
          serializador: 'ListaAutocompletar',
        },
      ),
    ).pipe(
      tap((respuesta) => {
        this.arrMetodosPago = respuesta[0].registros;
        this.arrPlazoPago = respuesta[1].registros;
        this.arrAsesor = respuesta[2].registros;
        this.arrSede = respuesta[3].registros;
        this.arrAlmacenes = respuesta[4].registros;

        if (!this.detalle) {
          this._initSugerencias();
        }

        this.changeDetectorRef.detectChanges();
      }),
    );
  }

  private _initSugerencias() {
    this._sugerirSede(0);
    this._sugeriAsesor(0);
  }

  private _sugerirSede(posicion: number) {
    if (this.arrSede.length > 0) {
      this.formularioFactura.patchValue({
        sede: this.arrSede?.[posicion].sede_id,
      });
    }
  }

  private _sugeriAsesor(posicion: number) {
    if (this.arrAsesor.length > 0) {
      this.formularioFactura.patchValue({
        asesor: this.arrAsesor?.[posicion].asesor_id,
      });
    }
  }
}
