import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { BuscarAvanzadoComponent } from '@comun/componentes/buscar-avanzado/buscar-avanzado.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { FormularioProductosComponent } from '@comun/componentes/factura/components/formulario-productos/formulario-productos.component';
import { TituloAccionComponent } from '@comun/componentes/titulo-accion/titulo-accion.component';
import { AnimacionFadeInOutDirective } from '@comun/directive/animacion-fade-in-out.directive';
import { FormularioFacturaService } from '@comun/services/factura/formulario-factura.service';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarGenContacto } from '@interfaces/comunes/autocompletar/general/gen-contacto.interface';
import { RegistroAutocompletarGenDocumentoReferencia } from '@interfaces/comunes/autocompletar/general/gen-documento.interface';
import { RegistroAutocompletarGenMetodoPago } from '@interfaces/comunes/autocompletar/general/gen-metodo-pago.interface';
import { RegistroAutocompletarGenPlazoPago } from '@interfaces/comunes/autocompletar/general/gen-plazo-pago.interface';
import { CampoLista } from '@interfaces/comunes/componentes/buscar-avanzado/buscar-avanzado.interface';
import { DocumentoFacturaRespuesta } from '@interfaces/comunes/factura/factura.interface';
import { Contacto } from '@interfaces/general/contacto';
import ContactDetalleComponent from '@modulos/general/paginas/contacto/contacto-formulario/contacto-formulario.component';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import {
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { tap, zip } from 'rxjs';
import {
  ParametrosApi,
  RespuestaApi,
} from 'src/app/core/interfaces/api.interface';
import { SeleccionarGrupoComponent } from '../../../../../../comun/componentes/factura/components/seleccionar-grupo/seleccionar-grupo.component';
import { FacturaCuentaComponent } from '../../factura/factura-cuenta/factura-cuenta.component';
import {
  CONTACTO_FILTRO_PERMANENTE_PROVEEDOR,
  CONTACTO_LISTA_BUSCAR_AVANZADO,
} from '@modulos/general/domain/mapeos/contacto.mapeo';
import { DOCUMENTO_REFERENCIA_LISTA_BUSCAR_AVANZADO, NOTA_DEBITO_DOCUMENTO_REFERENCIA_FILTRO_PERMANENTE } from '@modulos/compra/domain/mapeos/documento-referencia.mapeo';


@Component({
  selector: 'app-nota-debito-formulario',
  standalone: true,
  templateUrl: './nota-debito-formulario.component.html',
  styleUrls: ['./nota-debito-formulario.component.scss'],
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
    ContactDetalleComponent,
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
  public acumuladorDebitosCreditos =
    this._formularioFacturaService.acumuladorDebitosCreditos;
  public mostrarDocumentoReferencia =
    this._formularioFacturaService.mostrarDocumentoReferencia;
  public formularioFactura = this._formularioFacturaService.form;

  active: Number;
  arrMovimientosClientes: any[] = [];
  arrMovimientosDocumentosReferencia = signal<
    RegistroAutocompletarGenDocumentoReferencia[]
  >([]);
  arrMetodosPago: RegistroAutocompletarGenMetodoPago[] = [];
  arrPlazoPago: RegistroAutocompletarGenPlazoPago[] = [];
  plazo_pago_dias: any = 0;
  visualizarCampoDocumentoReferencia = false;
  @ViewChild('btnGuardar', { static: true }) btnGuardar: HTMLButtonElement;
  theme_value = localStorage.getItem('kt_theme_mode_value');

  public campoListaDocReferencia = DOCUMENTO_REFERENCIA_LISTA_BUSCAR_AVANZADO;
  public campoListaContacto = CONTACTO_LISTA_BUSCAR_AVANZADO;
  public filtrosPermanentesContacto = CONTACTO_FILTRO_PERMANENTE_PROVEEDOR;
  public filtrosPermanentesNotaDebito = {};

  constructor(
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

  onSeleccionarGrupoChange(id: number) {
    this.formularioFactura.get('grupo_contabilidad')?.setValue(id);
  }

  consultarInformacion() {
    zip(
      this._generalService.consultaApi<RegistroAutocompletarGenMetodoPago[]>(
        'general/metodo_pago/seleccionar/',
        {
          nombre__icontains: '',
          limit: 100,
        },
      ),
      this._generalService.consultaApi<RegistroAutocompletarGenPlazoPago[]>(
        'general/plazo_pago/seleccionar/',
        {
          nombre__icontains: '',
          limit: 100,
        },
      ),
    ).subscribe((respuesta) => {
      this.arrMetodosPago = respuesta[0];
      this.arrPlazoPago = respuesta[1];
      this.changeDetectorRef.detectChanges();
    });
  }

  get detalles() {
    return this.formularioFactura.get('detalles') as FormArray;
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
                documento_tipo: 7,
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

  private _limpiarDocumentoReferencia(contactoId: string) {
    const formularioContactoId = this.formularioFactura.get('contacto')?.value;
    if (formularioContactoId !== contactoId)
      this.formularioFactura.patchValue({
        documento_referencia_numero: null,
        documento_referencia: null,
      });
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

  private _inicializarFormulario(contactoId: string) {
    this.filtrosPermanentesNotaDebito = {
      contacto_id: contactoId,
      ...NOTA_DEBITO_DOCUMENTO_REFERENCIA_FILTRO_PERMANENTE,
    };
  }

  recibirDocumentoDetalle(documento: DocumentoFacturaRespuesta) {
    this._inicializarFormulario(`${documento.contacto_id}`);
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioFactura?.markAsDirty();
    this.formularioFactura?.markAsTouched();
    if (campo === 'contacto' || campo === 'contactoNuevoModal') {
      this._inicializarFormulario(dato.id);
      this._limpiarDocumentoReferencia(dato.id);
      this.formularioFactura.get(campo)?.setValue(dato.id);
      this.formularioFactura.get('contactoNombre')?.setValue(dato.nombre_corto);

      if (campo === 'contactoNuevoModal') {
        this.formularioFactura.get(campo)?.setValue(dato.id);
        this.formularioFactura
          .get('contactoNombre')
          ?.setValue(dato.nombre_corto);
      }
      this.formularioFactura
        .get('plazo_pago')
        ?.setValue(dato.plazo_pago_proveedor_id);
      if (dato.plazo_pago_dias > 0) {
        this.plazo_pago_dias = dato.plazo_pago_proveedor__dias;
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
      this.visualizarCampoDocumentoReferencia = true;
      this.changeDetectorRef.detectChanges();
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
    let parametros: ParametrosApi = {
      nombre_corto__icontains: `${event?.target.value}`,
      proveedor: 'True',
      limit: 100,
    };

    this._generalService
      .consultaApi<RegistroAutocompletarGenContacto[]>(
        'general/contacto/seleccionar/',
        parametros,
      )
      .pipe(
        tap((respuesta) => {
          this.arrMovimientosClientes = respuesta;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe();
  }

  consultarDocumentoReferencia(event: any) {
    let arrFiltros: ParametrosApi = {
      numero__icontains: `${event?.target.value}`,
      contacto_id: this.formularioFactura.get('contacto')?.value,
      documento_tipo__documento_clase_id: 301,
      estado_aprobado: 'True',
      limit: 100,
      serializador: 'referencia',
    };

    this._generalService
      .consultaApi<RespuestaApi<RegistroAutocompletarGenDocumentoReferencia>>(
        'general/documento/',
        arrFiltros,
      )
      .pipe(
        tap((respuesta) => {
          this.arrMovimientosDocumentosReferencia.set(respuesta.results);
        }),
      )
      .subscribe();
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
}
