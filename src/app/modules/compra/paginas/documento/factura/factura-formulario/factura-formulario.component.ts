import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
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
import { RegistroAutocompletarInvAlmacen } from '@interfaces/comunes/autocompletar/inventario/inv-alamacen';
import { DocumentoFacturaRespuesta } from '@interfaces/comunes/factura/factura.interface';
import { Contacto } from '@interfaces/general/contacto';
import { FACTURA_COMPRAS_CAMPOS_TABLA } from '@modulos/compra/domain/campos-tabla/factura-compra.campos-tabla';
import {
  ContactoFacturaZip,
  RespuestaFacturaCompraZip,
} from '@modulos/compra/interfaces/factura-formulario.interface';
import {
  CONTACTO_FILTRO_PERMANENTE_CLIENTE,
  CONTACTO_LISTA_BUSCAR_AVANZADO,
} from '@modulos/general/domain/mapeos/contacto.mapeo';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import {
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, tap, throttleTime, zip } from 'rxjs';
import { SeleccionarAlmacenComponent } from '../../../../../../comun/componentes/factura/components/seleccionar-almacen/seleccionar-almacen.component';
import { SeleccionarGrupoComponent } from '../../../../../../comun/componentes/factura/components/seleccionar-grupo/seleccionar-grupo.component';
import { ImportarDetallesComponent } from '../../../../../../comun/componentes/importar-detalles/importar-detalles.component';
import { ImportarPersonalizadoComponent } from '../../../../../../comun/componentes/importar-personalizado/importar-personalizado.component';
import ContactoFormulario from '../../../../../general/paginas/contacto/contacto-formulario/contacto-formulario.component';
import { FacturaCuentaComponent } from '../factura-cuenta/factura-cuenta.component';
import { FacturaInformacionExtraComponent } from '../factura-informacion-extra/factura-informacion-extra.component';

@Component({
  selector: 'app-factura-formulario',
  standalone: true,
  templateUrl: './factura-formulario.component.html',
  styleUrls: ['./factura-formulario.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbNavModule,
    BuscarAvanzadoComponent,
    CardComponent,
    AnimacionFadeInOutDirective,
    ContactoFormulario,
    FormularioProductosComponent,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
    ImportarPersonalizadoComponent,
    NgbDropdownModule,
    NgSelectModule,
    FacturaInformacionExtraComponent,
    FacturaCuentaComponent,
    SeleccionarGrupoComponent,
    SeleccionarAlmacenComponent,
    ImportarDetallesComponent,
  ],
})
export default class FacturaDetalleComponent
  extends General
  implements OnInit, OnDestroy
{
  private _formularioFacturaService = inject(FormularioFacturaService);
  private readonly _generalService = inject(GeneralService);

  public modoEdicion = this._formularioFacturaService.modoEdicion;
  public formularioTipo = this._formularioFacturaService.formularioTipo;
  public acumuladorImpuesto =
    this._formularioFacturaService.acumuladorImpuestos;
  public acumuladorDebitosCreditos =
    this._formularioFacturaService.acumuladorDebitosCreditos;
  public formaPagoLista: RegistroAutocompletarGenFormaPago[] = [];
  public estadoAprobado = this._formularioFacturaService.estadoAprobado;
  public eliminarDetallesIds =
    this._formularioFacturaService.eliminarDetallesIds;

  public FACTURA_COMPRAS_CAMPOS_TABLA = FACTURA_COMPRAS_CAMPOS_TABLA;
  formularioFactura: FormGroup;
  active: Number;
  arrMovimientosClientes: any[] = [];
  arrMetodosPago: RegistroAutocompletarGenMetodoPago[] = [];
  arrPlazoPago: RegistroAutocompletarGenPlazoPago[] = [];
  plazo_pago_dias: any = 0;
  visualizarCampoDocumentoReferencia = false;
  @ViewChild('btnGuardar', { static: true }) btnGuardar: HTMLButtonElement;
  theme_value = localStorage.getItem('kt_theme_mode_value');
  public campoListaContacto = CONTACTO_LISTA_BUSCAR_AVANZADO;
  public filtrosPermanentes = CONTACTO_FILTRO_PERMANENTE_CLIENTE;

  constructor(
    private httpService: HttpService,
    private facturaService: FacturaService,
    private modalService: NgbModal,
  ) {
    super();
  }

  ngOnInit() {
    this.formularioFactura = this._formularioFacturaService.form;
    this.formularioTipo.set('compra');
    this.active = 1;

    if (this.detalle) {
      this.modoEdicion.set(true);
    } else {
      this.modoEdicion.set(false);
      this.consultarInformacion().subscribe(() => {
        this._actualizarPlazoPago(
          this.formularioFactura.get('plazo_pago')?.value,
        );
      });
    }

    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this._formularioFacturaService.reiniciarFormulario();
  }

  onSeleccionarGrupoChange(id: number) {
    this.formularioFactura.get('grupo_contabilidad')?.setValue(id);
  }

  private _actualizarPlazoPago(plazoPagoId: number) {
    this.arrPlazoPago.find((plazoPago) => {
      if (plazoPago.id === plazoPagoId) {
        this.plazo_pago_dias = plazoPago.dias;
      }
    });
  }

  recibirDocumentoDetalleRespuesta(evento: DocumentoFacturaRespuesta) {
    this.consultarInformacion().subscribe(() => {
      this._actualizarPlazoPago(evento.plazo_pago_id);
    });
  }

  consultarInformacion() {
    return zip(
      this._generalService.consultaApi<RegistroAutocompletarGenMetodoPago[]>(
        'general/metodo_pago/seleccionar/',
      ),
      this._generalService.consultaApi<RegistroAutocompletarGenPlazoPago[]>(
        'general/plazo_pago/seleccionar/',
      ),
      this._generalService.consultaApi<RegistroAutocompletarGenFormaPago[]>(
        'general/forma_pago/seleccionar/',
      ),
    ).pipe(
      tap((respuesta) => {
        this.arrMetodosPago = respuesta[0];
        this.arrPlazoPago = respuesta[1];
        this.formaPagoLista = respuesta[2];

        this._sugerirPrimerValorFormaPago();
        this.changeDetectorRef.detectChanges();
      }),
    );
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
            // base_impuesto: this.formularioFactura.value.subtotal,
            numero: null,
            documento_tipo: 5,
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

  recibirAlmacenSeleccionado(almacen: RegistroAutocompletarInvAlmacen) {
    this.formularioFactura.get('almacen')?.setValue(almacen.id);
    this.formularioFactura.get('almacen_nombre')?.setValue(almacen.nombre);
  }

  recibirAlmacenVacio() {
    this.formularioFactura.get('almacen')?.setValue(null);
    this.formularioFactura.get('almacen_nombre')?.setValue('');
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioFactura?.markAsDirty();
    this.formularioFactura?.markAsTouched();
    if (campo === 'contacto') {
      const contacto = dato as RegistroAutocompletarGenContacto;
      this.formularioFactura.get(campo)?.setValue(contacto.id);
      this.formularioFactura.get('contactoNombre')?.setValue(contacto.nombre_corto);
      if (contacto.id && contacto.nombre_corto) {
        this.formularioFactura.get(campo)?.setValue(contacto.id);
        this.formularioFactura
          .get('contactoNombre')
          ?.setValue(contacto.nombre_corto);
      }
      this.formularioFactura
        .get('plazo_pago')
        ?.setValue(contacto.plazo_pago_proveedor_id);

      if (contacto.plazo_pago_proveedor__dias > 0) {
        this.plazo_pago_dias = contacto.plazo_pago_proveedor__dias;
        const diasNumero = parseInt(this.plazo_pago_dias, 10) + 1;
        let fechaInicio = this.formularioFactura.get('fecha')?.value;
        const fechaActual = new Date(fechaInicio); // Obtener la fecha actual
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
    // let arrFiltros: ParametrosFiltros = {
    //   filtros: [
    //     {
    //       propiedad: 'nombre_corto__icontains',
    //       valor1: `${event?.target.value}`,
    //     },
    //     {
    //       propiedad: 'proveedor',
    //       valor1: 'True',
    //     },
    //   ],
    //   limite: 10,
    //   desplazar: 0,
    //   ordenamientos: [],
    //   limite_conteo: 10000,
    //   modelo: 'GenContacto',
    //   serializador: 'ListaAutocompletar',
    // };

    this._generalService
      .consultaApi<RegistroAutocompletarGenContacto>(
        'general/contacto/seleccionar/',
        {
          nombre_corto__icontains: `${event?.target.value}`,
          proveedor: 'True',
        },
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta: any) => {
          this.arrMovimientosClientes = respuesta;
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
          valor2: '',
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
    this.changeDetectorRef.detectChanges();
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
    this.modificarCampoFormulario('contacto', contacto);
    this.modalService.dismissAll();
  }

  abrirModal(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
  }

  consultarDetalle() {
    // Notificar a través del servicio que se debe actualizar el documento
    this._formularioFacturaService.notificarActualizacionDocumento();
  }

  autocompletarEncabezado(respuestaFacturaCompra: RespuestaFacturaCompraZip) {
    const comentario =
      respuestaFacturaCompra.comentario.length <= 0
        ? null
        : respuestaFacturaCompra.comentario;

    this.formularioFactura.patchValue({
      referencia_numero: respuestaFacturaCompra.referencia_numero,
      referencia_cue: respuestaFacturaCompra.referencia_cue,
      referencia_prefijo: respuestaFacturaCompra.referencia_prefijo,
      fecha: respuestaFacturaCompra.fecha,
      comentario,
    });

    this._asignarContactoAFormulario(respuestaFacturaCompra.contacto);
  }

  private _asignarContactoAFormulario(contacto: ContactoFacturaZip) {
    this.formularioFactura.patchValue({
      contactoNombre: contacto.nombre_corto,
      contacto: contacto.id,
      plazo_pago: contacto.plazo_pago_proveedor_id,
    });

    this._actualizarFechas(contacto.plazo_pago_proveedor_dias);

    this.changeDetectorRef.detectChanges();
  }

  private _actualizarFechas(plazoPagoDias: number) {
    if (plazoPagoDias > 0) {
      this.plazo_pago_dias = plazoPagoDias;
      const diasNumero = parseInt(this.plazo_pago_dias, 10) + 1;
      let fechaInicio = this.formularioFactura.get('fecha')?.value;
      const fechaActual = new Date(fechaInicio); // Obtener la fecha actual
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
  }

  private _sugerirPrimerValorFormaPago() {
    if (!this.detalle) {
      if (this.formaPagoLista.length > 0) {
        this.formularioFactura.patchValue({
          forma_pago: this.formaPagoLista?.[0].id,
        });
      }
    }
  }
}
