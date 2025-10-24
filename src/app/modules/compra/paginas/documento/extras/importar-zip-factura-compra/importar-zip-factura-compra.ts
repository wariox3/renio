import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AnimationFadeInLeftDirective } from '@comun/directive/animation-fade-in-left.directive';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { FechasService } from '@comun/services/fechas.service';
import { HttpService } from '@comun/services/http.service';
import { Modelo } from '@comun/type/modelo.type';
import { ImportarDetallesErrores } from '@interfaces/comunes/importar/importar-detalles-errores.interface';
import { Contacto } from '@interfaces/general/contacto';
import { ModeloConfig } from '@interfaces/menu/configuracion.interface';
import { RespuestaImportarZipContacto, RespuestaImportarZipFacturaCompra } from '@modulos/compra/interfaces/respuesta-importar-zip-factura-compra';
import ContactoFormularioProveedorComponent from '@modulos/general/paginas/contacto/contacto-formulario-proveedor/contacto-formulario-proveedor.component';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, catchError, finalize, of, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-importar-zip-factura-compra',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, AnimationFadeInLeftDirective, ContactoFormularioProveedorComponent],
  templateUrl: './importar-zip-factura-compra.html',
  styleUrl: './importar-zip-factura-compra.scss',
})
export default class ImportarZipFacturaCompraComponent implements OnInit, OnDestroy {
  private readonly _modalService = inject(NgbModal);
  private readonly _httpService = inject(HttpService);
  private readonly _facturaService = inject(FacturaService);
  private readonly _fechasService = inject(FechasService);
  private readonly _router = inject(Router);
  private readonly _configModuleService = inject(ConfigModuleService);
  private _key: null | number | Modelo | undefined;
  private _destroy$ = new Subject<void>();

  public formularioPasos = signal([
    { id: 1, titulo: 'Seleccionar ZIP' },
    { id: 2, titulo: 'Contacto' },
    { id: 3, titulo: 'Confirmar datos Factura' },
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
  public datosFactura = signal<RespuestaImportarZipFacturaCompra | null>(null)
  public datosFacturaContacto = signal<RespuestaImportarZipContacto | null>(null)
  public configuracionCargarArchivo: {
    endpoint: string;
    datosOpcionalesPayload?: object;
  };
  public mensajeExitoso = signal('');
  @Output() consultarLista = new EventEmitter<void>();

  ngOnInit(): void {
    this._setupConfigModuleListener();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.unsubscribe();
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
      .post<RespuestaImportarZipFacturaCompra>('general/documento/importar-zip-dian/', payload)
      .pipe(
        finalize(() => this.cargardoDocumento$.next(false)),
        tap((respuesta) => {
          if (!respuesta.contacto.existe) {
            this._asignarPasoContacto()
          } else {
            this._asignarPasoFactura()
          }

          this.datosFactura.set(respuesta)
          this.datosFacturaContacto.set({
            ...respuesta.contacto,
            tipo_persona: 1
          })
        }),
        catchError((respuesta: ImportarDetallesErrores) => {
          if (respuesta.errores_validador) {
            this.cantidadErrores.set(respuesta.errores_validador.length);
          }
          return of(null);
        })
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
    const fechaVencimientoInicial =
      this._fechasService.getFechaVencimientoInicial();

    this._facturaService
      .guardarFactura({
        empresa: 1,
        contacto: this.datosFactura()?.contacto.contacto_id,
        totalCantidad: 0,
        contactoPrecio: 0,
        numero: null,
        fecha: fechaVencimientoInicial,
        fecha_vence: fechaVencimientoInicial,
        forma_pago: '',
        metodo_pago: 1,
        almacen: null,
        total: 0,
        subtotal: 0,
        base_impuesto: 0,
        impuesto: 0,
        impuesto_operado: 0,
        impuesto_retencion: 0,
        remision: null,
        orden_compra: null,
        descuento: 0,
        plazo_pago: 1,
        plazo_pago_id: 1,
        asesor: '',
        asesor_nombre_corto: null,
        resolucion: '',
        resolucion_numero: '',
        sede: '',
        sede_nombre: null,
        grupo_contabilidad: null,
        referencia_cue: this.datosFactura()?.documento.cue,
        referencia_numero: this.datosFactura()?.documento.numero,
        referencia_prefijo: this.datosFactura()?.documento.prefijo,
        pago: 0,
        pagos: [],
        detalles_eliminados: [],
        pagos_eliminados: [],
        documento_tipo: 5,
        comentario: this.datosFactura()?.documento.comentario,
        detalles: []//this.datosFactura()?.documento.detalles
      }).subscribe((respuesta) => {
        this._modalService.dismissAll();
        this._router.navigate(
          [`compra/documento/detalle/${respuesta.documento.id}`],
          {
            queryParams: {
              modelo: this._key,
            },
          },
        );
      })
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
    this._asignarPasoFactura()
  }

  private _asignarPasoContacto() {
    this.inhabilitarBtnCrearContacto.set(false)
    this.inhabilitarBtnCrearFactura.set(true)
    this.pasoFormularioActual.set(1)
  }


  private _asignarPasoFactura() {
    this.inhabilitarBtnCrearFactura.set(false)
    this.inhabilitarBtnCrearContacto.set(true)
    this.pasoFormularioActual.set(2)
  }

}
