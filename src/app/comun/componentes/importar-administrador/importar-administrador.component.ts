import { DescargarArchivosService } from '@comun/services/descargarArchivos.service';
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, of, tap } from 'rxjs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { AnimationFadeinLeftDirective } from '@comun/Directive/AnimationFadeinleft.directive';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-importar-administrador',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    AnimationFadeinUpDirective,
    AnimationFadeinLeftDirective,
    FormsModule
  ],
  templateUrl: './importar-administrador.component.html',
  styleUrl: './importar-administrador.component.scss',
})
export class ImportarAdministradorComponent extends General {
  archivoNombre: string = '';
  archivo_base64: string = '';
  errorImportar: ErroresDato[] = [];
  inputFile: any = null;
  cargardoDocumento: boolean = false;
  importarSoloNuevos: boolean = false;
  soloNuevos: boolean;
  @Input() estadoHabilitado: boolean = false;
  @Input() modelo: string;
  @Output() emitirDetallesAgregados: EventEmitter<any> = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private httpService: HttpService,
    private descargarArchivosService: DescargarArchivosService
  ) {
    super();
  }

  abrirModalContactoNuevo(content: any) {
    this.activatedRoute.queryParams
      .subscribe((parametros) => {
        this.importarSoloNuevos = parametros.importarSoloNuevos === 'si'? true : false
        this.soloNuevos = false,
        this.changeDetectorRef.detectChanges()
        this.archivoNombre = '';
        this.errorImportar = [];
        this.modalService.open(content, {
          ariaLabelledBy: 'modal-basic-title',
          size: 'xl',
        });
      })
      .unsubscribe();
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

  subirArchivo(archivo_base64: string) {
    let ruta = localStorage.getItem('ruta')!;
    this.activatedRoute.queryParams
      .subscribe((parametros) => {
        let esIndependiente = parametros.esIndependiente!;
        let modelo = '';
        if (this.modelo === 'MOVIMIENTO') {
          modelo = 'movimiento';
        } else {
          if (esIndependiente == 'no') {
            modelo = this.modelo.toLowerCase().substring(3, this.modelo.length);
          } else {
            modelo = this.modelo.toLowerCase();
          }
        }

        this.cargardoDocumento = true;
        this.changeDetectorRef.detectChanges();
        let url = `${ruta.toLowerCase()}/${modelo}/importar/`;
        this.httpService
          .post<ImportarDetalles>(url, {
            archivo_base64,
            solo_nuevos: this.soloNuevos
          })
          .pipe(
            tap((respuesta) => {
              this.alertaService.mensajaExitoso(
                `Se guardo la información registros importados: ${respuesta.registros_importados}`
              );
              this.soloNuevos= false;
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
      })
      .unsubscribe();
  }

  descargarExcelImportar() {
    this.activatedRoute.queryParams
      .subscribe((parametro) => {
        let fileUrl = `../../../../assets/ejemplos/modelo/${parametro.modelo}.xlsx`;
        this.descargarArchivosService
          .comprobarArchivoExiste(fileUrl)
          .subscribe((archivoExiste) => {
            if (archivoExiste) {
              let nombreArchivo = `adminsitrador_${parametro.modelo}.xlsx`;
              let esIndependite = parametro.esIndependiente!;
              if (esIndependite == 'si') {
                fileUrl = `../../../../assets/ejemplos/independiente/${localStorage
                  .getItem('ruta')!
                  .toLowerCase()
                  .substring(
                    0,
                    3
                  )}_${parametro.itemNombre?.toLocaleLowerCase()}.xlsx`;

                nombreArchivo = `${localStorage
                  .getItem('ruta')!
                  .toLowerCase()
                  .substring(
                    0,
                    3
                  )}_${parametro.itemNombre?.toLocaleLowerCase()}.xlsx`;
              }

              // Crear un enlace de descarga
              const link = document.createElement('a');
              link.href = fileUrl;
              link.download = nombreArchivo;
              // Añadir el enlace al DOM y hacer clic en él para iniciar la descarga
              document.body.appendChild(link);
              link.click();

              // Eliminar el enlace del DOM
              document.body.removeChild(link);
            }
          });
      })
      .unsubscribe();
  }

  descargarExcelError() {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      let nombreArchivo = `errores_${parametro.modelo}.xlsx`;

      let esIndependite = parametro.esIndependiente!;
      if (esIndependite == 'si') {
        nombreArchivo = `errores_${localStorage
          .getItem('ruta')!
          .toLowerCase()
          .substring(0, 3)}_${parametro.itemNombre?.toLocaleLowerCase()}.xlsx`;
      }

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
    });
  }
}
