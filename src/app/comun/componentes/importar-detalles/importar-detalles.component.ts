import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { General } from '@comun/clases/general';
import { AnimationFadeInLeftDirective } from '@comun/directive/animation-fade-in-left.directive';
import { AnimationFadeInUpDirective } from '@comun/directive/animation-fade-in-up.directive';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { HttpService } from '@comun/services/http.service';
import { ImportarDetallesErrores } from '@interfaces/comunes/importar/importar-detalles-errores.interface';
import { ImportarDetalles } from '@interfaces/comunes/importar/importar-detalles.interface';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import { catchError, mergeMap, of, take, tap, toArray } from 'rxjs';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-importar-detalles',
  standalone: true,
  imports: [
    CommonModule,
    NgbDropdownModule,
    TranslateModule,
    AnimationFadeInUpDirective,
    AnimationFadeInLeftDirective,
  ],
  templateUrl: './importar-detalles.component.html',
  styleUrl: './importar-detalles.component.scss',
})
export class ImportarDetallesComponent extends General {
  archivoNombre: string = '';
  archivo_base64: string = '';
  errorImportar: any[] = [];
  archivoPeso: string = '';
  inputFile: any = null;
  cargardoDocumento: boolean = false;
  cantidadErrores: number = 0;
  @Input() estadoHabilitado: boolean = false;
  @Input() aplicarUrlInventario: boolean = false;
  @Output() emitirDetallesAgregados: EventEmitter<any> = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private httpService: HttpService,
    private descargarArchivosService: DescargarArchivosService
  ) {
    super();
  }

  abrirModalContactoNuevo(content: any) {
    this.errorImportar = [];
    this.archivoNombre = '';
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'xl',
    });
  }

  cerrarModal() {
    this.modalService.dismissAll();
    this.errorImportar = [];
    this.archivoNombre = '';
  }

  archivoSeleccionado(event: any) {
    this.inputFile = event.target.files[0];
    const selectedFile = event.target.files[0];
    this.archivoNombre = selectedFile.name;
    this.changeDetectorRef.detectChanges();
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

  async guardarArchivo() {
    this.subirArchivo(await this.toBase64(this.inputFile));
  }

  subirArchivo(archivo_base64: string) {
    this.cargardoDocumento = true;
    this.changeDetectorRef.detectChanges();
    let url = '';
    switch (this.ubicacion) {
      case 'documento':
        url = 'general/documento/importar-detalle/';
        break;
      case 'administrador':
        url = 'general/importar/importar-detalle/';
        break;
    }
    if(this.aplicarUrlInventario){
      	url = 'general/documento/importar-detalle-inventario/'
    }
    this.httpService
      .post<ImportarDetalles>(url, {
        documento_id: this.parametrosUrl?.detalle,
        archivo_base64,
      })
      .pipe(
        tap((respuesta) => {
          this.alertaService.mensajaExitoso(
            `Se guardo la información registros importados: ${respuesta.registros_importados}`
          );
          this.modalService.dismissAll();
          this.errorImportar = [];
          this.cargardoDocumento = false;
          this.changeDetectorRef.detectChanges();
          this.emitirDetallesAgregados.emit(respuesta);
        }),
        catchError((respuesta: ImportarDetallesErrores) => {
          if (respuesta.errores_validador) {
            this.cantidadErrores = respuesta.errores_validador.length;
            this._adaptarErroresImportar(respuesta.errores_validador);
          }
          this.cargardoDocumento = false;
          this.changeDetectorRef.detectChanges();
          return of(null);
        })
      )
      .subscribe();
  }

  descargarExcelImportar() {
    const nombreArchivo = this.descargarArchivosService._construirNombreArchivo(
      this.parametrosUrl,
      this.ubicacion,
      undefined
    );

    this.descargarArchivosService
      .descargarArchivoLocal(
        `assets/ejemplos/documentoDetalle/${nombreArchivo}.xlsx`,
        `documentoDetalle_${this.parametrosUrl?.documento_clase}`
      )
      .subscribe();
  }

  descargarExcelError() {
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
    saveAs(data, `errores_${this.parametrosUrl?.documento_clase}.xlsx`); // Nombre del archivo Excel a descargar
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
