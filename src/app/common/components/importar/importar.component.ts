import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnimationFadeInLeftDirective } from '@comun/directive/animation-fade-in-left.directive';
import { AnimationFadeInUpDirective } from '@comun/directive/animation-fade-in-up.directive';
import { AlertaService } from '@comun/services/alerta.service';
import { HttpService } from '@comun/services/http.service';
import { ButtonComponent } from '../ui/button/button.component';
import { ImportarDetallesErrores } from '@interfaces/comunes/importar/importar-detalles-errores.interface';
import { ImportarDetalles } from '@interfaces/comunes/importar/importar-detalles.interface';
import {
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import {
  finalize,
  from,
  mergeMap,
  Subject,
  take,
  takeUntil,
  toArray
} from 'rxjs';
import * as XLSX from 'xlsx';
import { maestros } from './constants/maestros.constant';

/**
 * Configuración requerida por el componente para saber a qué endpoint
 * enviar el archivo y cómo presentar las opciones al usuario.
 */
interface ImportarConfig {
  /** Ruta del endpoint que recibe el archivo en base64. */
  endpoint: string;
  /** ID del documento asociado a la importación, si aplica. */
  documentoId?: number;
  /** Nombre descriptivo del tipo de importación (ej: "facturas"). */
  nombre: string | undefined;
  /** Ruta del archivo Excel de ejemplo descargable por el usuario. */
  rutaEjemplo: string | undefined;
  /** Controla la visibilidad del botón de importar en el template. */
  verBotonImportar: boolean | undefined;
  /** Controla la visibilidad del botón de descargar ejemplo. */
  verBotonEjemplo: boolean | undefined;
}

@Component({
  selector: 'app-importar',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    AnimationFadeInUpDirective,
    AnimationFadeInLeftDirective,
    FormsModule,
    NgbDropdownModule,
    NgbNavModule,
    ButtonComponent,
  ],
  templateUrl: './importar.component.html',
  styleUrl: './importar.component.scss',
})
export class ImportarComponent implements OnDestroy {
  /** Configuración del endpoint y opciones visuales del importador. */
  @Input() importarConfig: ImportarConfig | undefined = undefined;
  @Input() estadoHabilitado: boolean = false;
  /**
   * Parámetros adicionales que se fusionan en el payload antes de enviarlo
   * al endpoint (ej: filtros de fecha, identificadores de módulo).
   */
  @Input() parametros: { [key: string]: any } = {};
  /** Emite la respuesta del servidor cuando la importación es exitosa. */
  @Output() emitirDetallesAgregados: EventEmitter<any> = new EventEmitter();

  // Metadatos del archivo seleccionado para mostrarlo en el template.
  public archivo = {
    nombre: '',
    peso: '',
  };
  /** Pestaña activa en el nav (1 = importar, 2 = errores). */
  public active: number = 1;
  /**
   * Primeros 100 errores formateados para la visualización en tabla.
   * El límite evita renderizar miles de filas y degradar la UI.
   */
  public errorImportar = signal<any[]>([]);
  public inputFile: File | null = null;
  public cargandoDocumento = signal<boolean>(false);
  public cantidadErrores = signal<number>(0);
  public maestros = maestros;

  /**
   * Subject para cancelar suscripciones activas cuando el componente
   * se destruye, evitando memory leaks.
   */
  private _unsubscribe$ = new Subject<void>();
  /**
   * Copia completa de los errores del servidor, sin límite de filas.
   * Se usa exclusivamente para generar el Excel de descarga; la señal
   * errorImportar solo guarda los primeros 100 para la UI.
   */
  private _erroresCompletos: any[] = [];
  private _modalService = inject(NgbModal);
  private _httpService = inject(HttpService);
  private _cdr = inject(ChangeDetectorRef);
  private _alertaService = inject(AlertaService);

  archivoSeleccionado(event: any) {
    // files?.[0] puede ser undefined si el usuario abre el diálogo y cancela.
    const selectedFile: File | undefined = event.target.files?.[0];
    if (!selectedFile) return;
    this.inputFile = selectedFile;
    this.archivo.nombre = selectedFile.name;
    this.archivo.peso = (selectedFile.size / 1024).toFixed(2) + ' KB';
    // El componente usa OnPush implícito vía signals; aquí forzamos la
    // detección porque "archivo" es un objeto plano, no una signal.
    this._cdr.detectChanges();
  }

  async guardarArchivo() {
    if (!this.inputFile) return;
    this.subirArchivo(await this.toBase64(this.inputFile));
  }

  async toBase64(file: File) {
    try {
      const reader = new FileReader();
      const base64ConMetadatos: any = await new Promise((resolve, reject) => {
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });
      // readAsDataURL devuelve "data:<mime>;base64,<datos>".
      // El backend solo espera la parte de datos, sin el prefijo de metadatos.
      return base64ConMetadatos.split(',')[1];
    } catch (error) {
      throw new Error('Error al convertir el archivo a base64');
    }
  }

  removerArchivoSeleccionado() {
    this.archivo.nombre = '';
    this.archivo.peso = '';
    this.inputFile = null;
  }

  private _reiniciarErrores() {
    this.cantidadErrores.set(0);
    this.errorImportar.set([]);
    this._erroresCompletos = [];
  }

  subirArchivo(archivo_base64: string) {
    this._reiniciarErrores();
    this.cargandoDocumento.set(true);

    // filtrosExternos y parametros se fusionan para enviar el contexto
    // completo al backend junto con el archivo.
    let data: { [key: string]: any } = {
      ...this.parametros,
      archivo_base64,
    };

    this._httpService
      .post<ImportarDetalles>(`${this.importarConfig?.endpoint}`, data)
      .pipe(
        finalize(() => {
          this.cargandoDocumento.set(false);
        }),
        takeUntil(this._unsubscribe$),
      )
      .subscribe({
        next: (response) => {
          this._modalService.dismissAll();
          this.emitirDetallesAgregados.emit(response);
          this._alertaService.mensajaExitoso(
            `Se guardo la información registros importados: ${response.registros_importados}`,
          );
        },
        error: (response: ImportarDetallesErrores) => {
          if (response.errores_validador) {
            this.cantidadErrores.set(response.errores_validador.length);
            this._adaptarErroresImportar(response.errores_validador);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  descargarExcelError() {
    const nombreArchivo = `errores_${this.importarConfig?.nombre ?? 'importacion'}.xlsx`;
    this.cargandoDocumento.set(true);

    // El setTimeout cede el hilo al navegador para que actualice el spinner
    // antes de iniciar el procesamiento síncrono del Excel.
    setTimeout(() => {
      const procesarPorLotes = async () => {
        const erroresCompletos: any[] = [];
        // Lotes de 500 filas para no bloquear el hilo principal en cada iteración.
        const tamanoLote = 500;

        for (let i = 0; i < this._erroresCompletos.length; i += tamanoLote) {
          const lote = this._erroresCompletos.slice(i, i + tamanoLote);

          const erroresLote = lote.reduce((acc: any[], errorItem: any) => {
            const erroresFormateados = Object.entries(errorItem.errores).map(
              ([campo, mensajes]: any) => ({
                fila: errorItem.fila,
                campo: campo,
                error: Array.isArray(mensajes) ? mensajes.join(', ') : mensajes,
              }),
            );
            return [...acc, ...erroresFormateados];
          }, []);

          erroresCompletos.push(...erroresLote);

          // Cede el hilo entre lotes para mantener la UI responsiva.
          await new Promise((resolve) => setTimeout(resolve, 0));
        }

        const worksheet: XLSX.WorkSheet =
          XLSX.utils.json_to_sheet(erroresCompletos);
        const workbook: XLSX.WorkBook = {
          Sheets: { data: worksheet },
          SheetNames: ['data'],
        };
        const excelBuffer: any = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array',
        });
        const data: Blob = new Blob([excelBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(data, nombreArchivo);

        this.cargandoDocumento.set(false);
        this._cdr.detectChanges();
      };

      procesarPorLotes().catch(() => {
        this.cargandoDocumento.set(false);
        this._alertaService.mensajeError(
          'Error',
          'Error al generar el archivo de errores',
        );
        this._cdr.detectChanges();
      });
    }, 100);
  }

  private _adaptarErroresImportar(errores: any[]) {
    // Guardamos la lista completa para la exportación Excel sin límite.
    this._erroresCompletos = errores;

    // from() en lugar de of(...errores) para evitar exceder el call stack
    // de JavaScript cuando el array tiene miles de elementos.
    from(errores)
      .pipe(
        // Cada elemento del array puede tener múltiples campos con error;
        // mergeMap los aplana en una secuencia plana de objetos formateados.
        mergeMap((errorItem) =>
          from(
            Object.entries(errorItem.errores).map(
              ([campo, mensajes]: any) => ({
                fila: errorItem.fila,
                campo: campo,
                error: Array.isArray(mensajes) ? mensajes.join(', ') : mensajes,
              }),
            ),
          ),
        ),
        // Limitamos la UI a 100 filas para no degradar el rendimiento del DOM.
        // El Excel de descarga sí incluye todos los errores (_erroresCompletos).
        take(100),
        toArray(),
        takeUntil(this._unsubscribe$),
      )
      .subscribe((result) => {
        this.errorImportar.set(result);
      });
  }
}
