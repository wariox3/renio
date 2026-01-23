import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { FormularioFacturaService } from '@comun/services/factura/formulario-factura.service';
import {
  DocumentoDetalleFactura,
  DocumentoFacturaRespuesta,
  ImpuestoRespuestaConsulta,
  RespuestaItem,
} from '@interfaces/comunes/factura/factura.interface';
import {
  NgbDropdownModule,
  NgbModal,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { map, Subject, takeUntil } from 'rxjs';
import { FacturaService } from '../../services/factura.service';
import { SeleccionarAlmacenComponent } from '../seleccionar-almacen/seleccionar-almacen.component';
import { SeleccionarGrupoComponent } from '../seleccionar-grupo/seleccionar-grupo.component';
import { SeleccionarImpuestosComponent } from '../seleccionar-impuestos/seleccionar-impuestos.component';
import { SeleccionarProductoComponent } from '../seleccionar-producto/seleccionar-producto.component';
import { RegistroAutocompletarInvAlmacen } from '@interfaces/comunes/autocompletar/inventario/inv-alamacen';
import { AgregarDetallesDocumentoComponent } from '../../../agregar-detalles-documento/agregar-detalles-documento.component';
import { FACTURA_COMPRAS_CAMPOS_TABLA } from '@modulos/compra/domain/campos-tabla/factura-compra.campos-tabla';
import { AdapterService } from '../../services/adapter.service';
import { BuscarDocumentosDetallesComponent } from '@comun/componentes/buscar-documento-detalles/buscar-documento-detalles.component';
import { FilterField } from 'src/app/core/interfaces/filtro.interface';
import { GeneralService } from '@comun/services/general.service';
import {
  AgregarAuiComponent,
  ItemAIU,
} from '../agregar-aui/agregar-aui.component';
import { ItemSeleccionar } from '@interfaces/general/item.interface';
import { HttpService } from '@comun/services/http.service';
import { ExtraerIvaComponent } from '../extraer-iva/extraer-iva.component';

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
    AgregarDetallesDocumentoComponent,
    BuscarDocumentosDetallesComponent,
    AgregarAuiComponent,
    NgbDropdownModule,
    ExtraerIvaComponent
  ],
  templateUrl: './formulario-productos.component.html',
  styleUrl: './formulario-productos.component.scss',
})
export class FormularioProductosComponent
  extends General
  implements OnDestroy, OnInit
{
  private _formularioFacturaService = inject(FormularioFacturaService);
  private _facturaService = inject(FacturaService);
  private _unsubscribe$ = new Subject<void>();
  private _generalService = inject(GeneralService);
  private _httpService = inject(HttpService);
  private modalService = inject(NgbModal);

  public FACTURA_COMPRAS_CAMPOS_TABLA = FACTURA_COMPRAS_CAMPOS_TABLA;
  public formularioFactura = this._formularioFacturaService.form;
  public themeValue = localStorage.getItem('kt_theme_mode_value');
  public modoEdicion = this._formularioFacturaService.modoEdicion;
  public estadoAprobado = this._formularioFacturaService.estadoAprobado;
  public indexSelecccionado = signal<number>(0)

  @ViewChild('agregarAuiRef') agregarAuiRef!: AgregarAuiComponent;
  public BUSCAR_DOCUMENTO_DETALLES_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
  ];

  @Input() mostrarDocumentoReferencia: boolean = false;
  @Input() mostrarBuscarDocumentos: boolean = false;
  @Input() mostrarImportarDesdeDocumento: boolean = false;
  @Input() mostrarIncluirIva: boolean = false;
  @Input() cuentasConImpuestos: boolean = false;
  @Input() habilitarConsultaPrecio: boolean = false;
  @Input() permiteCantidadCero = false;
  @Input({ required: true }) formularioTipo: 'venta' | 'compra' = 'venta';
  @Input() deshabilitar: boolean = false;
  @Input() mostrarCampoAIU: boolean = false;
  @Input() columnasTablaDatos: any = [];
  @Input() mostrarCampoDetalle: boolean = false;
  @Input() mostrarLectorCodigoBarras: boolean = false;
  @Input() configuracionDocumento: {
    endpoint: string;
    queryParams: { [key: string]: string | number | boolean };
  } = {
    endpoint: 'general/documento_detalle/lista_agregar_documento_detalle/',
    queryParams: {
      documento_tipo: 0,
    },
  };
  @Output() emitirEnviarFormulario: EventEmitter<void>;
  @Output() emitirDocumentoDetalle: EventEmitter<DocumentoFacturaRespuesta>;

  constructor() {
    super();
    this.emitirEnviarFormulario = new EventEmitter<void>();
    this.emitirDocumentoDetalle = new EventEmitter();
  }

  ngOnInit(): void {
    this._cargarVista();

    // Suscribirse al observable de actualización de documento
    this._formularioFacturaService.actualizarDocumento$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(() => {
        console.log('actualizarDocumento$');
        this.actualizarDocumento();
      });
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

  onSeleccionarGrupoChange(id: number, indexFormulario: number) {
    this._formularioFacturaService.onSeleccionarGrupoChange(
      id,
      indexFormulario,
    );
  }

  eliminarItem(indexFormulario: number) {
    this._formularioFacturaService.eliminarItem(indexFormulario);
  }

  /**
   * Se ejecuta cuando el usuario da clic engregar nuevo item
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
    // Obtener el detalle actual de la línea
    const detalleActual = this.detalles.at(indexFormulario);
    const itemActualId = detalleActual?.get('item')?.value;

    // Evitar seleccionar el mismo item en la misma línea
    if (itemActualId && itemActualId === item.id) {
      console.warn('No se puede seleccionar el mismo item en la misma línea');
      return;
    }

    const contactoPrecio = this.formularioFactura.value.contactoPrecio;

    if (contactoPrecio && this.habilitarConsultaPrecio) {
      // Usar switchMap para manejar la operación asíncrona
      this._consultarPrecioLista(contactoPrecio, item.id).subscribe(
        (respuesta) => {
          const itemActualizado = {
            ...item,
            precio: respuesta.vr_precio ? respuesta.vr_precio : item.precio,
          };

          this._procesarItemSeleccionado(itemActualizado, indexFormulario);
        },
      );
    } else {
      // Si no hay contactoPrecio, procesar directamente
      this._procesarItemSeleccionado(item, indexFormulario);
    }
  }

  private _procesarItemSeleccionado(
    item: DocumentoDetalleFactura,
    indexFormulario: number,
  ) {
    // Obtener el detalle actual para logging
    const detalleActual = this.detalles.at(indexFormulario);
    const itemActualId = detalleActual?.get('item')?.value;

    // Log para debugging cuando se cambia de item
    if (itemActualId && itemActualId !== item.id) {
      console.log(
        `Cambiando de item ${itemActualId} a ${item.id} en línea ${indexFormulario}`,
      );
    }

    this._formularioFacturaService.recibirItemSeleccionado(
      item,
      indexFormulario,
    );
    this.changeDetectorRef.detectChanges();
  }

  recibirAlmacenSeleccionado(
    almacen: RegistroAutocompletarInvAlmacen,
    index: number,
  ) {
    if (!almacen) {
      this._formularioFacturaService.onSeleccionarAlmacenChange(null, index);
    } else {
      this._formularioFacturaService.onSeleccionarAlmacenChange(almacen, index);
    }
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
    this._formularioFacturaService.recibirImpuestosModificados(
      impuestos,
      indexFormulario,
    );
    this.changeDetectorRef.detectChanges();
  }

  cargarItemsSeleccionadosDesdeDocumento(items: DocumentoDetalleFactura[]) {
    items.forEach((item) => {
      this.agregarNuevoItem('I');
      this.recibirItemSeleccionado(item, this.detalles.length - 1);
    });
    this.modalService.dismissAll();
  }

  recibirConfiguracionAUI(configuracion: ItemAIU[]) {
    this._procesarItemsAIUSecuencialmente(configuracion, 0);
  }

  extraerPrecio(index: number) {
    const detalleFormGroup = this.detalles.at(index);
    const impuestos = detalleFormGroup.get('impuestos')?.value;
    const precio = detalleFormGroup.get('precio')?.value;

    if (impuestos && impuestos.length > 0 && precio) {
      const precioSinIva = this.extraerTodosLosImpuestos(precio, impuestos);
      console.log('Precio sin IVA:', precioSinIva.toFixed(2));

      // Actualizar el valor del FormControl correctamente
      detalleFormGroup.get('precio')?.setValue(precioSinIva.toFixed(2));
      this._formularioFacturaService.actualizarPrecioItem(index);
    }
  }

  abrirModalExtraerIVA(modal: any, index: number) {
    this.indexSelecccionado.set(index);
    this.modalService.open(modal, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'md',
    });
  }

  extraerTodosLosImpuestos(precio: number, impuestos: any[]): number {
    let precioActual = precio;

    // Aplicar cada impuesto en orden inverso (extraer en el orden opuesto a como se aplicaron)
    for (let i = impuestos.length - 1; i >= 0; i--) {
      const porcentaje = impuestos[i].porcentaje;
      precioActual = this.extraerIVA(precioActual, porcentaje);
    }

    return precioActual;
  }

  extraerIVA(precio: number, porcentajeIVA: number) {
    const ivaDecimal = porcentajeIVA / 100;
    const precioSinIva = precio / (1 + ivaDecimal);
    return precioSinIva;
  }

  private _procesarItemsAIUSecuencialmente(
    configuracion: ItemAIU[],
    indice: number,
  ) {
    // Si ya procesamos todos los items, desactivar loader y cerrar el modal
    if (indice >= configuracion.length) {
      if (this.agregarAuiRef) {
        this.agregarAuiRef.finalizarCarga();
      }
      this.modalService.dismissAll();
      return;
    }

    const item = configuracion[indice];
    this._consultarItemDetalle(item.item_id, item.precio, () => {
      // Procesar el siguiente item después de que se complete el actual
      this._procesarItemsAIUSecuencialmente(configuracion, indice + 1);
    });
  }

  private _consultarItemDetalle(
    itemId: number,
    precio: number,
    callback?: () => void,
  ) {
    this._httpService
      .post<RespuestaItem>('general/item/detalle/', {
        id: itemId,
        venta: true,
        compra: false,
      })
      .pipe(
        map((respuesta) => {
          return {
            ...respuesta.item,
            precio: precio,
          };
        }),
      )
      .subscribe((respuesta) => {
        this.agregarNuevoItem('I');
        this.recibirItemSeleccionado(respuesta, this.detalles.length - 1);

        // Ejecutar callback si se proporciona (para procesamiento secuencial)
        if (callback) {
          callback();
        }
      });
  }

  private _consultarPrecioLista(precioId: number, itemId: number) {
    return this._generalService
      .consultaApi<{
        vr_precio: number;
      }>('general/precio_detalle/consultar_precio/', { item_id: itemId, precio_id: precioId })
      .pipe(takeUntil(this._unsubscribe$));
  }

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
    const detalleId = this.activatedRoute.snapshot.paramMap.get('id');
    if (detalleId) {
      this.modoEdicion.set(true);
      this.detalle = Number(detalleId);
      this._cargarFormulario(this.detalle);
    } else {
      this.modoEdicion.set(false);
    }
  }

  abrirModal(modal: any) {
    this.modalService.open(modal, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
  }

  actualizarDocumento() {
    this._cargarVista();
    this.modalService.dismissAll();
  }

  /**
   * Se ejecuta cuando el lector de código de barras captura un código
   * Busca el producto por código y lo agrega automáticamente
   *
   * @param event - Evento del input
   */
  onCodigoBarrasCapturado(event: Event) {
    const input = event.target as HTMLInputElement;
    const codigo = input.value.trim();

    if (!codigo) {
      return;
    }

    // Buscar el item por código
    this._generalService
      .consultaApi<ItemSeleccionar[]>('general/item/seleccionar/', {
        codigo__icontains: codigo,
        inactivo: 'False'
      })
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((items) => {
        if (items.length === 0) {
          this.alertaService.mensajeError(
            'Error',
            'No se encontró ningún producto con ese código'
          );
          input.value = '';
          return;
        }

        // Si hay coincidencia exacta, usar ese item
        const itemExacto = items.find(item => item.codigo === codigo);
        const itemSeleccionado = itemExacto || items[0];

        // Consultar detalle del item
        const parametrosConsulta = {
          id: itemSeleccionado.id,
          venta: this.formularioTipo === 'venta',
          compra: this.formularioTipo === 'compra',
        };

        this._httpService
          .post<RespuestaItem>('general/item/detalle/', parametrosConsulta)
          .pipe(takeUntil(this._unsubscribe$))
          .subscribe((respuesta) => {
            // Agregar nueva línea y seleccionar el item
            this.agregarNuevoItem('I');
            this.recibirItemSeleccionado(respuesta.item, this.detalles.length - 1);

            // Limpiar el input para el siguiente escaneo
            input.value = '';

            // Enfocar nuevamente el input para el siguiente código
            setTimeout(() => {
              input.focus();
            }, 100);
          });
      });
  }

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

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
