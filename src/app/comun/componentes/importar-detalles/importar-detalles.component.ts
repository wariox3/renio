import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { General } from '@comun/clases/general';
import { AnimationFadeinUpDirective } from '@comun/Directive/AnimationFadeinUp.directive';
import { HttpService } from '@comun/services/http.service';
import {
  ErroresDato,
  ImportarDetalles,
  ImportarDetallesErrores,
} from '@interfaces/comunes/importar-detalles.';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, of, tap } from 'rxjs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { AnimationFadeinLeftDirective } from '@comun/Directive/AnimationFadeinleft.directive';
import { DescargarArchivosService } from '@comun/services/descargarArchivos.service';
@Component({
  selector: 'app-importar-detalles',
  standalone: true,
  imports: [
    CommonModule,
    NgbDropdownModule,
    TranslateModule,
    AnimationFadeinUpDirective,
    AnimationFadeinLeftDirective,
  ],
  templateUrl: './importar-detalles.component.html',
  styleUrl: './importar-detalles.component.scss',
})
export class ImportarDetallesComponent extends General {
  archivoNombre: string = '';
  archivo_base64: string = '';
  errorImportar: ErroresDato[] = [];
  inputFile: any = null;
  cargardoDocumento: boolean = false;
  @Input() estadoHabilitado: boolean = false;
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
    const { detalle: documento_id } = this.parametrosUrl;
    let url = '';
    switch (this.ubicacion) {
      case 'documento':
        url = 'general/documento/importar-detalle/';
        break;
      case 'administrador':
        url = 'general/importar/importar-detalle/';
        break;
    }
    this.httpService
      .post<ImportarDetalles>(url, {
        documento_id,
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
          if (respuesta.errores_datos) {
            this.errorImportar = respuesta.errores_datos;
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
        `documentoDetalle_${this.parametrosUrl.documento_clase}`
      )
      .subscribe();
  }

  descargarExcelError() {
    const { documento_clase } = this.parametrosUrl;
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
    saveAs(data, `errores_${documento_clase}.xlsx`); // Nombre del archivo Excel a descargar
  }
}
