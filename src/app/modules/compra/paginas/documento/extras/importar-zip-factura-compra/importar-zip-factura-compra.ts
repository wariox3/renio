import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnDestroy, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertaService } from '@comun/services/alerta.service';
import { FechasService } from '@comun/services/fechas.service';
import { HttpService } from '@comun/services/http.service';
import { ImportarDetallesErrores } from '@interfaces/comunes/importar/importar-detalles-errores.interface';
import { RespuestaImportarZipFacturaCompra } from '@modulos/compra/interfaces/respuesta-importar-zip-factura-compra';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, catchError, finalize, of, Subject, tap } from 'rxjs';

@Component({
  selector: 'app-importar-zip-factura-compra',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './importar-zip-factura-compra.html',
  styleUrl: './importar-zip-factura-compra.scss',
})
export default class ImportarZipFacturaCompraComponent implements OnDestroy {
  private readonly _modalService = inject(NgbModal);
  private readonly _httpService = inject(HttpService);
  private readonly alertaService = inject(AlertaService);
  private readonly _facturaService = inject(FacturaService);
  private readonly _fechasService = inject(FechasService);

  private readonly _unsubscribe$ = new Subject<void>();
  public btnCrearFactura = signal(false);
  public archivoNombre = signal('');
  public archivoPeso = signal('');
  public errorImportar = signal<any[]>([]);
  public inputFile = signal<any>(null);
  public cargardoDocumento$ = new BehaviorSubject<boolean>(false);
  public cantidadErrores = signal(0);
  public datosFactura = signal<RespuestaImportarZipFacturaCompra | null>(null)
  public configuracionCargarArchivo: {
    endpoint: string;
    datosOpcionalesPayload?: object;
  };
  public mensajeExitoso = signal('');
  @Output() consultarLista = new EventEmitter<void>();

  cerrarModal() {
    this.errorImportar.set([]);
    this._modalService.dismissAll();
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
          if (respuesta.contacto) {
            this.btnCrearFactura.set(true)
            this.datosFactura.set(respuesta)
          }
          this.errorImportar.set([]);
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

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  crearFactura() {
    const fechaVencimientoInicial =
      this._fechasService.getFechaVencimientoInicial();

    this._facturaService
      .guardarFactura({
        empresa: 1,
        contacto: this.datosFactura()?.contacto.id,
        totalCantidad: 0,
        contactoPrecio: this.datosFactura()?.contacto.precio_id,
        numero: null,
        fecha: this.datosFactura()?.fecha,
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
        asesor: '',
        asesor_nombre_corto: null,
        resolucion: '',
        resolucion_numero: '',
        sede: '',
        sede_nombre: null,
        grupo_contabilidad: null,
        referencia_cue: this.datosFactura()?.referencia_cue,
        referencia_numero: this.datosFactura()?.referencia_numero,
        referencia_prefijo: this.datosFactura()?.referencia_prefijo,
        detalles: [],
        pago: 0,
        pagos: [],
        detalles_eliminados: [],
        pagos_eliminados: [],
        documento_tipo: 5,
        comentario: this.datosFactura()?.comentario,
      }).subscribe((respuesta) => {
        this.consultarLista.emit()
      })
  }
}
