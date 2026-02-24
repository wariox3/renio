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

interface ImportarConfig {
  endpoint: string;
  documentoId?: number;
  nombre: string | undefined;
  rutaEjemplo: string | undefined;
  verBotonImportar: boolean | undefined;
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
  @Input() importarConfig: ImportarConfig | undefined = undefined;
  @Input() estadoHabilitado: boolean = false;
  @Input() parametros: { [key: string]: any } = {};
  @Input() filtrosExternos: { [key: string]: any } = {};
  @Output() emitirDetallesAgregados: EventEmitter<any> = new EventEmitter();

  public archivo = {
    nombre: '',
    peso: '',
  };
  public active: number = 1;
  public errorImportar = signal<any[]>([]);
  public inputFile: File | null = null;
  public cargandoDocumento = signal<boolean>(false);
  public cantidadErrores = signal<number>(0)
  public maestros = maestros;

  private _unsubscribe$ = new Subject<void>();
  private _erroresCompletos: any[] = [];
  private _modalService = inject(NgbModal);
  private _httpService = inject(HttpService);
  private _cdr = inject(ChangeDetectorRef);
  private _alertaService = inject(AlertaService);

  archivoSeleccionado(event: any) {
    const selectedFile: File | undefined = event.target.files?.[0];
    if (!selectedFile) return;
    this.inputFile = selectedFile;
    this.archivo.nombre = selectedFile.name;
    this.archivo.peso = (selectedFile.size / 1024).toFixed(2) + ' KB';
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
      // Remover los metadatos
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
    this.cantidadErrores.set(0)
    this.errorImportar.set([]);
    this._erroresCompletos = [];
    // this._cdr.detectChanges();
  }

  subirArchivo(archivo_base64: string) {
    this._reiniciarErrores();
    this.cargandoDocumento.set(true);

    let data: { [key: string]: any } = {
      ...this.filtrosExternos,
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
    let nombreArchivo = `errores_${this.importarConfig?.nombre}.xlsx`;

    // Procesar todos los errores para el Excel, pero en lotes para evitar bloqueos
    this.cargandoDocumento.set(true);

    // Usar setTimeout para permitir que la UI se actualice antes de iniciar el procesamiento
    setTimeout(() => {
      const procesarPorLotes = async () => {
        const erroresCompletos: any[] = [];
        const tamanoLote = 500; // Tamaño de lote razonable

        // Procesar en lotes
        for (let i = 0; i < this._erroresCompletos.length; i += tamanoLote) {
          const lote = this._erroresCompletos.slice(i, i + tamanoLote);

          // Procesar cada lote
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

          // Permitir que el navegador respire entre lotes
          await new Promise((resolve) => setTimeout(resolve, 0));
        }

        // Crear y descargar el Excel con todos los errores
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
    // Guardar los errores completos para exportación
    this._erroresCompletos = errores;

    from(errores)
      .pipe(
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
        take(100), // Mantener el límite para la visualización en UI
        toArray(),
        takeUntil(this._unsubscribe$),
      )
      .subscribe((result) => {
        this.errorImportar.set(result);
      });
  }
}
