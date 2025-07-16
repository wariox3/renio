import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { BuscarAvanzadoComponent } from '@comun/componentes/buscar-avanzado/buscar-avanzado.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { FormularioProductosComponent } from '@comun/componentes/factura/components/formulario-productos/formulario-productos.component';
import { AnimacionFadeInOutDirective } from '@comun/directive/animacion-fade-in-out.directive';
import { FormularioFacturaService } from '@comun/services/factura/formulario-factura.service';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarGenContacto } from '@interfaces/comunes/autocompletar/general/gen-contacto.interface';
import { RegistroAutocompletarGenMetodoPago } from '@interfaces/comunes/autocompletar/general/gen-metodo-pago.interface';
import { RegistroAutocompletarGenPlazoPago } from '@interfaces/comunes/autocompletar/general/gen-plazo-pago.interface';
import { DocumentoFacturaRespuesta } from '@interfaces/comunes/factura/factura.interface';
import { Contacto } from '@interfaces/general/contacto';
import { NOTA_AJUSTE_DOCUMENTO_REFERENCIA_FILTRO_PERMANENTE } from '@modulos/compra/domain/mapeos/documento-referencia.mapeo';
import {
  CONTACTO_FILTRO_PERMANENTE_CLIENTE,
  CONTACTO_LISTA_BUSCAR_AVANZADO,
} from '@modulos/general/domain/mapeos/contacto.mapeo';
import { DOCUMENTO_REFERENCIA_LISTA_BUSCAR_AVANZADO } from '@modulos/venta/domain/mapeos/documento-referencia.mapeo';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import {
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, tap, throttleTime, zip } from 'rxjs';
import { SeleccionarGrupoComponent } from '../../../../../../comun/componentes/factura/components/seleccionar-grupo/seleccionar-grupo.component';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import ContactoFormulario from '../../../../../general/paginas/contacto/contacto-formulario/contacto-formulario.component';

@Component({
  selector: 'app-nota-ajuste-formulario',
  standalone: true,
  templateUrl: './nota-ajuste-formulario.component.html',
  styleUrls: ['./nota-ajuste-formulario.component.scss'],
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
  ],
})
export default class FacturaDetalleComponent
  extends General
  implements OnInit, OnDestroy
{
  private _formularioFacturaService = inject(FormularioFacturaService);
  private readonly _generalService = inject(GeneralService);

  public mostrarDocumentoReferencia =
    this._formularioFacturaService.mostrarDocumentoReferencia;
  public modoEdicion = this._formularioFacturaService.modoEdicion;
  public formularioTipo = this._formularioFacturaService.formularioTipo;
  public acumuladorImpuesto =
    this._formularioFacturaService.acumuladorImpuestos;
  public estadoAprobado = this._formularioFacturaService.estadoAprobado;
  public formularioFactura = this._formularioFacturaService.form;

  active: Number;
  arrMovimientosClientes: any[] = [];
  arrMetodosPago: RegistroAutocompletarGenMetodoPago[] = [];
  arrPlazoPago: RegistroAutocompletarGenPlazoPago[] = [];
  arrDetallesEliminado: number[] = [];
  arrImpuestosEliminado: number[] = [];
  plazo_pago_dias: any = 0;
  visualizarCampoDocumentoReferencia = false;
  @ViewChild('btnGuardar', { static: true }) btnGuardar: HTMLButtonElement;
  theme_value = localStorage.getItem('kt_theme_mode_value');

  public campoListaContacto = CONTACTO_LISTA_BUSCAR_AVANZADO;
  public filtrosPermanentesContacto = CONTACTO_FILTRO_PERMANENTE_CLIENTE;
  public campoListaDocReferencia = DOCUMENTO_REFERENCIA_LISTA_BUSCAR_AVANZADO;
  public filtrosPermanentesNotaAjuste =
    NOTA_AJUSTE_DOCUMENTO_REFERENCIA_FILTRO_PERMANENTE;

  constructor(
    private facturaService: FacturaService,
    private modalService: NgbModal,
  ) {
    super();
  }

  ngOnInit() {
    this.consultarInformacion();
    this.active = 1;
    if (this.detalle) {
      this.modoEdicion.set(true);
      this._formularioFacturaService.mostrarDocumentoReferencia.set(true)
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
      this._generalService.consultaApi<RegistroAutocompletarGenMetodoPago>(
        'general/metodo_pago/seleccionar/',
      ),
      this._generalService.consultaApi<RegistroAutocompletarGenPlazoPago>(
        'general/plazo_pago/seleccionar/',
      ),
    ).subscribe((respuesta: any) => {
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
                documento_tipo: 12,
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

  actualizarFormulario(dato: any, campo: string) {
    if (campo === 'contacto') {
      this._inicializarFormulario(dato.id);
      this._limpiarDocumentoReferencia(dato.id);
      this.formularioFactura.get(campo)?.setValue(dato.id);
      this.formularioFactura.get('contactoNombre')?.setValue(dato.nombre_corto);
    }
    if (campo === 'documento_referencia') {
      this.formularioFactura.get('documento_referencia')?.setValue(dato.id);
      this.formularioFactura
        .get('documento_referencia_numero')
        ?.setValue(dato.numero);
    }
    this.formularioFactura?.markAsDirty();
    this.formularioFactura?.markAsTouched();
    this.changeDetectorRef.detectChanges();
  }

  private _inicializarFormulario(contactoId: string) {
    this.filtrosPermanentesNotaAjuste = {
      contacto_id: contactoId,
      ...NOTA_AJUSTE_DOCUMENTO_REFERENCIA_FILTRO_PERMANENTE
    };
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioFactura?.markAsDirty();
    this.formularioFactura?.markAsTouched();
    if (campo === 'contacto' || campo === 'contactoNuevoModal') {
      const contacto = dato as RegistroAutocompletarGenContacto;
      this._inicializarFormulario(contacto.id.toString());
      this._limpiarDocumentoReferencia(contacto.id.toString());
      this.formularioFactura.get(campo)?.setValue(contacto.id);
      this.formularioFactura.get('contactoNombre')?.setValue(contacto.nombre_corto);
      if (campo === 'contactoNuevoModal') {
        this.formularioFactura.get('contacto')?.setValue(contacto.id);
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
      console.log(dato);

      this.formularioFactura.get('documento_referencia')?.setValue(dato.id);
      this.formularioFactura
        .get('documento_referencia_numero')
        ?.setValue(dato.numero);
    }
    this.changeDetectorRef.detectChanges();
  }

  consultarCliente(event: any) {
    this._generalService
      .consultaApi<RegistroAutocompletarGenContacto>(
        'general/contacto/seleccionar/',
        {
          nombre_corto__icontains: `${event?.target.value}`,
          proveedor: 'True',
          limit: 10,
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
    this._generalService
      .consultaApi<RegistroAutocompletarGenContacto>('general/documento/', {
        numero__icontains: `${event?.target.value}`,
        contacto_id: this.formularioFactura.get('contacto')?.value,
        documento_tipo__documento_clase_id: 303,
        estado_aprobado: 'True',
        limit: 5,
        serializador: 'referencia',
      })
      .pipe(
        throttleTime(600, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta: any) => {
          this.arrMovimientosClientes = respuesta.results;
          this.changeDetectorRef.detectChanges();
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
