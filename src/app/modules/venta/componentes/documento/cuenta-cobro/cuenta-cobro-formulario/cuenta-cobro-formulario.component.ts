import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BuscarAvanzadoComponent } from '@comun/componentes/buscar-avanzado/buscar-avanzado.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { CuentaBancoComponent } from '@comun/componentes/cuenta-banco/cuenta-banco.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezadoFormularioNuevo/encabezadoFormularioNuevo.component';
import { FormularioProductosComponent } from '@comun/componentes/factura/components/formulario-productos/formulario-productos.component';
import { TituloAccionComponent } from '@comun/componentes/titulo-accion/titulo-accion.component';
import { AnimacionFadeInOutDirective } from '@comun/Directive/AnimacionFadeInOut.directive';
import { SoloNumerosDirective } from '@comun/Directive/solo-numeros.directive';
import { FormularioFacturaService } from '@comun/services/factura/formulario-factura.service';
import { HttpService } from '@comun/services/http.service';
import { validarPrecio } from '@comun/validaciones/validar-precio.validate';
import {
  AutocompletarRegistros,
  RegistroAutocompletarContacto,
} from '@interfaces/comunes/autocompletar';
import { CampoLista } from '@interfaces/comunes/componentes/buscar-avanzado/buscar-avanzado.interface';
import {
  AcumuladorImpuestos,
  PagoFormulario,
} from '@interfaces/comunes/factura/factura.interface';
import { Contacto } from '@interfaces/general/contacto';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import ContactoFormulario from '@modulos/general/componentes/contacto/contacto-formulario/contacto-formulario.component';
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

@Component({
  selector: 'app-factura-formulario',
  standalone: true,
  templateUrl: './cuenta-cobro-formulario.component.html',
  styleUrls: ['./cuenta-cobro-formulario.component.scss'],
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
    TituloAccionComponent,
    EncabezadoFormularioNuevoComponent
],
})
export default class CuentaCobroFormularioComponent extends General implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _facturaService = inject(FacturaService);
  private _httpService = inject(HttpService);
  private _empresaService = inject(EmpresaService);
  private _modalService = inject(NgbModal);
  private _formularioFacturaService = inject(FormularioFacturaService);

  public formularioFactura: FormGroup;
  public active: Number;
  public estado_aprobado: false;
  public dataUrl: any;
  public visualizarCampoDocumentoReferencia = false;
  public botonGuardarDeshabilitado$: BehaviorSubject<boolean>;

  public plazo_pago_dias: any = 0;
  public arrMovimientosClientes: any[] = [];
  public arrMetodosPago: any[] = [];
  public arrPlazoPago: any[] = [];
  public arrAsesor: any[] = [];
  public arrSede: any[] = [];
  public requiereAsesor: boolean = false;
  public requiereSede: boolean = false;
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
    },
    {
      propiedad: 'numero_identificacion',
      titulo: 'identificacion',
    },
    {
      propiedad: 'nombre_corto',
      titulo: 'nombre_corto',
    },
  ];
  public filtrosPermanentes = [
    {
      operador: '',
      propiedad: 'cliente',
      valor1: 'True',
      valor2: '',
    },
  ];

  public modoEdicion: boolean = false;
  public theme_value = localStorage.getItem('kt_theme_mode_value');
  public acumuladorImpuesto: AcumuladorImpuestos = {};

  constructor() {
    super();
    this.botonGuardarDeshabilitado$ = new BehaviorSubject<boolean>(false);
    this.formularioFactura = this._formularioFacturaService.createForm();
  }

  ngOnInit() {
    this._consultarInformacion();
    this.active = 1; // navigation tab

    if (this.parametrosUrl) {
      this.dataUrl = this.parametrosUrl;
    }

    if (this.detalle) {
      this.detalle = this.activatedRoute.snapshot.queryParams['detalle'];
      this.modoEdicion = true;
    } else {
      this.modoEdicion = false;
    }

    this.changeDetectorRef.detectChanges();
  }

  actualizarImpuestosAcumulados(impuestosAcumulados: AcumuladorImpuestos) {
    this.acumuladorImpuesto = impuestosAcumulados;
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
          'Los pagos agregados no pueden tener pagos en cero'
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
        'Los pagos agregados son superiores al total de la factura'
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

    if (this.detalle !== undefined) {
      this._actualizarFactura();
    } else {
      this._guardarFactura();
    }
  }

  private _actualizarFactura() {
    if (this.validarCamposDetalles() === false) {
      this._facturaService
        .actualizarDatosFactura(this.detalle, this.formularioFactura.value)
        .pipe(
          tap((respuesta) => {
            this.router.navigate(['documento/detalle'], {
              queryParams: {
                ...this.parametrosUrl,
                detalle: respuesta.documento.id,
              },
            });
          }),
          catchError(() => {
            this.botonGuardarDeshabilitado$.next(false);
            return of(null);
          })
        )
        .subscribe();
    }
  }

  private _guardarFactura() {
    if (this.validarCamposDetalles() === false) {
      this._facturaService
        .guardarFactura({
          ...this.formularioFactura.value,
          ...{
            numero: null,
            documento_tipo: 17,
          },
        })
        .pipe(
          tap((respuesta) => {
            this.router.navigate(['documento/detalle'], {
              queryParams: {
                ...this.parametrosUrl,
                detalle: respuesta.documento.id,
              },
            });
          }),
          catchError(() => {
            this.botonGuardarDeshabilitado$.next(false);
            return of(null);
          })
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
          'contiene campos vacios'
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
          'contiene campos en cero'
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
            'El valor ingresado del pago es mayor al total general'
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
        'Los pagos agregados son superiores al total de la factura'
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
          propiedad: 'cliente',
          valor1: 'True',
          valor2: '',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'GenContacto',
      serializador: 'ListaAutocompletar',
    };

    this._httpService
      .post<AutocompletarRegistros<RegistroAutocompletarContacto>>(
        'general/funcionalidad/lista/',
        arrFiltros
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrMovimientosClientes = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  consultarDocumentoReferencia(event: any) {
    let arrFiltros = {
      filtros: [
        {
          operador: '__icontains',
          propiedad: 'numero__icontains',
          valor1: `${event?.target.value}`,
          valor2: '',
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
        })
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
        this.formularioFactura.get('fecha_vence')?.setValue(fechaVencimiento);
      }

      if (
        this.parametrosUrl.documento_clase == 2 ||
        this.parametrosUrl.documento_clase == 3
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

  private _consultarInformacion() {
    zip(
      this._httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista/',
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
          modelo: 'GenMetodoPago',
          serializador: 'ListaAutocompletar',
        }
      ),
      this._httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista/',
        {
          filtros: [],
          limite: 10,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'GenPlazoPago',
          serializador: 'ListaAutocompletar',
        }
      ),
      this._httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista/',
        {
          filtros: [],
          limite: 10,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'GenAsesor',
          serializador: 'ListaAutocompletar',
        }
      ),
      this._httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista/',
        {
          filtros: [],
          limite: 10,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'GenSede',
          serializador: 'ListaAutocompletar',
        }
      ),
      this._empresaService.obtenerConfiguracionEmpresa(1)
    ).subscribe((respuesta: any) => {
      this.arrMetodosPago = respuesta[0].registros;
      this.arrPlazoPago = respuesta[1].registros;
      this.arrAsesor = respuesta[2].registros;
      this.arrSede = respuesta[3].registros;
      this.requiereAsesor = respuesta[4].venta_asesor;
      this.requiereSede = respuesta[4].venta_sede;
      this.changeDetectorRef.detectChanges();
    });
  }
}