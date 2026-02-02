import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AnimationFadeInLeftDirective } from '@comun/directive/animation-fade-in-left.directive';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { FechasService } from '@comun/services/fechas.service';
import { HttpService } from '@comun/services/http.service';
import { Modelo } from '@comun/type/modelo.type';
import { ImportarDetallesErrores } from '@interfaces/comunes/importar/importar-detalles-errores.interface';
import { Contacto } from '@interfaces/general/contacto';
import { ModeloConfig } from '@interfaces/menu/configuracion.interface';
import {
  RespuestaImportarZipContacto,
  RespuestaImportarZipFacturaCompra,
} from '@modulos/compra/interfaces/respuesta-importar-zip-factura-compra';
import ContactoFormularioProveedorComponent from '@modulos/general/paginas/contacto/contacto-formulario-proveedor/contacto-formulario-proveedor.component';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  catchError,
  finalize,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
  zip,
} from 'rxjs';
import { SeleccionarGrupoComponent } from '@comun/componentes/factura/components/seleccionar-grupo/seleccionar-grupo.component';
import { SeleccionarAlmacenComponent } from '@comun/componentes/factura/components/seleccionar-almacen/seleccionar-almacen.component';
import { RegistroAutocompletarInvAlmacen } from '@interfaces/comunes/autocompletar/inventario/inv-alamacen';
import { RegistroAutocompletarGenFormaPago } from '@interfaces/comunes/autocompletar/general/gen-forma-pago.interface';
import { GeneralService } from '@comun/services/general.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { AlertaService } from '@comun/services/alerta.service';

@Component({
  selector: 'app-importar-zip-factura-compra',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AnimationFadeInLeftDirective,
    ContactoFormularioProveedorComponent,
    SeleccionarGrupoComponent,
    SeleccionarAlmacenComponent,
    NgSelectModule,
  ],
  templateUrl: './importar-zip-factura-compra.html',
  styleUrl: './importar-zip-factura-compra.scss',
})
export default class ImportarZipFacturaCompraComponent
  implements OnInit, OnDestroy
{
  private readonly _modalService = inject(NgbModal);
  private readonly _httpService = inject(HttpService);
  private readonly _facturaService = inject(FacturaService);
  private readonly _fechasService = inject(FechasService);
  private readonly _router = inject(Router);
  private readonly _configModuleService = inject(ConfigModuleService);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _generalService = inject(GeneralService);
  private readonly _alertaService = inject(AlertaService);

  private _key: null | number | Modelo | undefined;
  private _destroy$ = new Subject<void>();

  public formularioPasos = signal([
    { id: 1, titulo: 'Seleccionar ZIP', descripcion: 'Sube tu archivo' },
    { id: 2, titulo: 'Proveedor', descripcion: 'Información del proveedor' },
    {
      id: 3,
      titulo: 'Confirmar datos Factura',
      descripcion: 'Revisa y confirma',
    },
  ]);
  public inhabilitarBtnCrearFactura = signal(false);
  public inhabilitarBtnCrearContacto = signal(false);
  public archivoNombre = signal('');
  public archivoPeso = signal('');
  public errorImportar = signal<any[]>([]);
  public inputFile = signal<any>(null);
  public cargardoDocumento$ = new BehaviorSubject<boolean>(false);
  public cantidadErrores = signal(0);
  public pasoFormularioActual = signal(0);
  public datosFactura = signal<RespuestaImportarZipFacturaCompra | null>(null);
  public datosFacturaContacto = signal<RespuestaImportarZipContacto | null>(
    null,
  );
  public configuracionCargarArchivo: {
    endpoint: string;
    datosOpcionalesPayload?: object;
  };
  public mensajeExitoso = signal('');
  public formularioFactura: FormGroup;
  public formaPagoLista = signal<RegistroAutocompletarGenFormaPago[]>([]);

  @Input() desdeUtilidad: boolean;
  @Output() consultarLista = new EventEmitter<void>();

  ngOnInit(): void {
    this._setupConfigModuleListener();
    this.createForm();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.unsubscribe();
  }

  createForm() {
    this.formularioFactura = this._formBuilder.group({
      almacen: [1],
      almacen_nombre: ['Principal'],
      forma_pago: [1],
      grupo_contabilidad: [1],
    });
  }

  private _setupConfigModuleListener() {
    this._configModuleService.currentModelConfig$
      .pipe(takeUntil(this._destroy$))
      .subscribe((value) => {
        this._loadModuleConfiguration(value);
      });
  }

  cerrarModal() {
    this.errorImportar.set([]);
    this._modalService.dismissAll();
  }

  private _loadModuleConfiguration(modeloConfig: ModeloConfig | null) {
    this._key = modeloConfig?.key;
  }

  archivoSeleccionado(event: any) {
    const selectedFile = event.target.files[0];
    this.inputFile.set(event.target.files[0]);
    this.archivoNombre.set(selectedFile.name);
    this.archivoPeso.set(`${(selectedFile.size / 1024).toFixed(2)} KB`);
  }

  removerArchivoSeleccionado() {
    this.archivoNombre.set('');
  }

  async guardarArchivo() {
    this.subirArchivo(await this.toBase64(this.inputFile()));
  }

  subirArchivo(archivoBase64: string) {
    this.cargardoDocumento$.next(true);

    const payload = {
      archivo_base64: archivoBase64,
    };

    this._httpService
      .post<RespuestaImportarZipFacturaCompra>(
        'general/documento/importar-zip-dian/',
        payload,
      )
      .pipe(
        finalize(() => this.cargardoDocumento$.next(false)),
        tap((respuesta) => {
          if (!respuesta.contacto.existe) {
            this._asignarPasoContacto();
          } else {
            this._asignarPasoFactura();
          }

          this.datosFactura.set(respuesta);
          this.datosFacturaContacto.set({
            ...respuesta.contacto,
            tipo_persona: 1,
          });
        }),
        catchError((respuesta: ImportarDetallesErrores) => {
          if (respuesta.errores_validador) {
            this.cantidadErrores.set(respuesta.errores_validador.length);
          }
          return of(null);
        }),
      )
      .subscribe();
  }

  async toBase64(file: File) {
    try {
      const reader = new FileReader();
      const base64ConMetadatos: any = await new Promise((resolve, reject) => {
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });
      // Remover los metadatos
      return base64ConMetadatos.split(',')[1];
    } catch (error) {
      throw new Error('Error al convertir el archivo a base64');
    }
  }

  crearFactura() {
    let subtotal = 0;
    let total = 0;

    // Solo calcular los valores pero NO incluir los detalles
    if (this.desdeUtilidad) {
      const datos = this.datosFactura();
      if (datos?.documento?.detalles) {
        // Calcular subtotal procesando los detalles
        subtotal = datos.documento.detalles.reduce(
          (sum, detalle) =>
            sum + (parseFloat(detalle?.valor_total || '0') || 0),
          0,
        );
        total = subtotal;

        // Redondear a 2 decimales
        subtotal = Math.round(subtotal * 100) / 100;
        total = Math.round(total * 100) / 100;
        // O también puedes usar: subtotal = parseFloat(subtotal.toFixed(2));
      }
    }

    const datosFactura = this.datosFactura();
    const documento = datosFactura?.documento;
    const contacto = datosFactura?.contacto;

    // Asegurar que los valores estén redondeados antes de enviar
    const subtotalRedondeado = Math.round(subtotal * 100) / 100;
    const totalRedondeado = Math.round(total * 100) / 100;

    const data = {
      empresa: 1,
      contacto: contacto?.contacto_id,
      totalCantidad: 0,
      contactoNombre: '',
      contactoPrecio: null,
      numero: null,
      fecha: documento?.fecha,
      fecha_vence: documento?.fecha_vence,
      forma_pago: this.formularioFactura.get('forma_pago')?.value,
      forma_pago_nombre: '',
      metodo_pago: 1,
      metodo_pago_nombre: '',
      almacen: this.formularioFactura.get('almacen')?.value,
      almacen_nombre: '',
      total: totalRedondeado, // Usar valor redondeado
      subtotal: subtotalRedondeado, // Usar valor redondeado
      base_impuesto: 0,
      impuesto: 0,
      impuesto_operado: 0,
      impuesto_retencion: 0,
      remision: null,
      pago: 0,
      total_bruto: totalRedondeado, // También redondear total_bruto
      comentario: documento?.comentario?.substring(0, 500) || null,
      orden_compra: null,
      documento_referencia: null,
      documento_referencia_numero: null,
      asesor: '',
      asesor_nombre_corto: null,
      sede: '',
      sede_nombre: null,
      resolucion: '',
      resolucion_numero: '',
      descuento: 0,
      grupo_contabilidad:
        this.formularioFactura.get('grupo_contabilidad')?.value,
      plazo_pago: contacto?.plazo_pago_id,
      detalles: [],
      pagos: [],
      referencia_cue: documento?.cue,
      referencia_numero: documento?.numero,
      referencia_prefijo: documento?.prefijo,
      pagos_eliminados: [],
      detalles_eliminados: [],
      documento_tipo: 5,
    };

    if (this.desdeUtilidad) {
      this._facturaService
        .guardarFactura(data)
        .pipe(
          switchMap((respuesta) => {
            if (!respuesta?.documento?.id) {
              throw new Error('No se recibió un ID de documento válido');
            }
            return this._httpService.post('general/documento/aprobar/', {
              id: respuesta.documento.id,
            });
          }),
        )
        .subscribe({
          next: () => {
            this._modalService.dismissAll();
            this.consultarLista.emit();
          },
          error: () => {
            this._alertaService.mensajeError(
              'Error',
              'No se pudo completar la operación',
            );
          },
        });
    } else {
      this._facturaService.guardarFactura(data).subscribe(
        (respuesta) => {
          if (!respuesta?.documento?.id) {
            console.error('No se recibió un ID de documento válido');
            return;
          }

          this._modalService.dismissAll();
          this._router.navigate(
            [`compra/documento/detalle/${respuesta.documento.id}`],
            {
              queryParams: {
                modelo: this._key,
              },
            },
          );
        },
        (error) => {
          console.error('Error al guardar factura:', error);
        },
      );
    }
  }

  crearContacto(contacto: Contacto) {
    this.datosFactura.update((prev) => {
      if (!prev) return prev; // Si aún no hay datos, no hace nada
      return {
        ...prev,
        contacto: {
          ...prev.contacto,
          contacto_id: contacto.id!, // o el valor que quieras asignar
        },
      };
    });
    this._asignarPasoFactura();
  }

  private _asignarPasoContacto() {
    this.inhabilitarBtnCrearContacto.set(false);
    this.inhabilitarBtnCrearFactura.set(true);
    this.pasoFormularioActual.set(1);
  }

  private _asignarPasoFactura() {
    this.inhabilitarBtnCrearFactura.set(false);
    this.inhabilitarBtnCrearContacto.set(true);
    this.consultarInformacion();
    this.pasoFormularioActual.set(2);
  }

  consultarInformacion() {
    zip(
      this._generalService.consultaApi<RegistroAutocompletarGenFormaPago[]>(
        'general/forma_pago/seleccionar/',
      ),
    ).subscribe((respuesta: any) => {
      this.formaPagoLista.set(respuesta[0]);
    });
  }

  onSeleccionarGrupoChange(id: number) {
    this.formularioFactura.get('grupo_contabilidad')?.setValue(id);
  }

  recibirAlmacenSeleccionado(almacen: RegistroAutocompletarInvAlmacen) {
    this.formularioFactura.get('almacen')?.setValue(almacen.id);
    this.formularioFactura.get('almacen_nombre')?.setValue(almacen.nombre);
  }

  recibirAlmacenVacio() {
    this.formularioFactura.get('almacen')?.setValue(null);
    this.formularioFactura.get('almacen_nombre')?.setValue('');
  }
}
