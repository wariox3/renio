import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { AnimationFadeInLeftDirective } from '@comun/directive/animation-fade-in-left.directive';
import { AnimationFadeInUpDirective } from '@comun/directive/animation-fade-in-up.directive';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { HttpService } from '@comun/services/http.service';
import { Filtros } from '@interfaces/comunes/componentes/filtros/filtros.interface';
import { ImportarDetallesErrores } from '@interfaces/comunes/importar/importar-detalles-errores.interface';
import { ImportarDetalles } from '@interfaces/comunes/importar/importar-detalles.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import {
  BehaviorSubject,
  catchError,
  finalize,
  mergeMap,
  of,
  Subject,
  take,
  tap,
  toArray,
} from 'rxjs';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-importar-personalizado',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    AnimationFadeInUpDirective,
    AnimationFadeInLeftDirective,
    FormsModule,
  ],
  templateUrl: './importar-personalizado.component.html',
  styleUrl: './importar-personalizado.component.scss',
})
export class ImportarPersonalizadoComponent
  extends General
  implements OnDestroy
{
  public archivoNombre: string = '';
  public archivoPeso: string = '';
  public errorImportar: any[] = [];
  public inputFile: any = null;
  public cargardoDocumento$ = new BehaviorSubject<boolean>(false);
  public cantidadErrores: number = 0;

  private readonly _unsubscribe$ = new Subject<void>();

  @Input() extensionesPermitidas: string;
  @Input() mensajeExitoso: string;
  @Input({ required: true }) configuracionCargarArchivo: {
    endpoint: string;
    datosOpcionalesPayload?: object;
  };
  @Input() configuracionDescargarEjemplo: {
    modelo: string;
    serializador: string;
    filtros: Filtros[];
    ordenamientos: string[];
  };

  @Output() emitirPeticionCompletada: EventEmitter<any> = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private httpService: HttpService,
    private descargarArchivosService: DescargarArchivosService
  ) {
    super();
  }

  cerrarModal() {
    this.modalService.dismissAll();
    this.errorImportar = [];
    this.changeDetectorRef.detectChanges();
  }

  archivoSeleccionado(event: any) {
    this.inputFile = event.target.files[0];
    const selectedFile = event.target.files[0];
    this.archivoNombre = selectedFile.name;
    this.archivoPeso = (selectedFile.size / 1024).toFixed(2) + ' KB';
    this.changeDetectorRef.detectChanges();
  }

  async guardarArchivo() {
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
    this.archivoNombre = '';
  }

  subirArchivo(archivoBase64: string) {
    this.cargardoDocumento$.next(true);

    const payload = {
      archivo_base64: archivoBase64,
      ...this.configuracionCargarArchivo.datosOpcionalesPayload,
    };

    this.httpService
      .post<ImportarDetalles>(this.configuracionCargarArchivo.endpoint, payload)
      .pipe(
        finalize(() => this.cargardoDocumento$.next(false)),
        tap((respuesta) => {
          if (this.mensajeExitoso) {
            this.alertaService.mensajaExitoso(`${this.mensajeExitoso}`);
          } else {
            this.alertaService.mensajaExitoso(
              `${respuesta.mensaje}: ${respuesta.registros_importados}`
            );
          }
          this.modalService.dismissAll();
          this.errorImportar = [];
          this.changeDetectorRef.detectChanges();
          this.emitirPeticionCompletada.emit(respuesta);
        }),
        catchError((respuesta: ImportarDetallesErrores) => {
          if (respuesta.errores_validador) {
            this.cantidadErrores = respuesta.errores_validador.length;
            this._adaptarErroresImportar(respuesta.errores_validador);
          }
          this.changeDetectorRef.detectChanges();
          return of(null);
        })
      )
      .subscribe();
  }

  descargarEjemplo() {
    this.activatedRoute.queryParams
      .subscribe(() => {
        this.descargarArchivosService.descargarExcelAdminsitrador(
          this.configuracionDescargarEjemplo.modelo,
          {
            modelo: this.configuracionDescargarEjemplo.modelo,
            serializador: this.configuracionDescargarEjemplo.serializador,
            excel: true,
            filtros: [...this.configuracionDescargarEjemplo.filtros],
            ordenamientos: this.configuracionDescargarEjemplo.ordenamientos,
          }
        );
      })
      .unsubscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  descargarExcelError() {
    this.activatedRoute.queryParams
      .subscribe((parametro) => {
        let nombreArchivo = `errores_${this.configuracionDescargarEjemplo.modelo}.xlsx`;

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
          this.errorImportar
        );
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
        saveAs(data, nombreArchivo); // Nombre del archivo Excel a descargar
      })
      .unsubscribe();
  }

  private _adaptarErroresImportar(errores: any[]) {
    of(...errores)
      .pipe(
        mergeMap((errorItem) =>
          of(
            ...Object.entries(errorItem.errores).map(
              ([campo, mensajes]: any) => ({
                fila: errorItem.fila,
                campo: campo,
                error: mensajes.join(', '),
              })
            )
          )
        ),
        take(100), // Limita la cantidad de errores procesados a 100
        toArray()
      )
      .subscribe((result) => {
        this.errorImportar = result;
      });
  }
}
