import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { AnimationFadeinLeftDirective } from '@comun/Directive/AnimationFadeinleft.directive';
import { AnimationFadeinUpDirective } from '@comun/Directive/AnimationFadeinUp.directive';
import { DescargarArchivosService } from '@comun/services/descargarArchivos.service';
import { HttpService } from '@comun/services/http.service';
import { ErroresDato, ImportarDetalles, ImportarDetallesErrores } from '@interfaces/comunes/importar-detalles.';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-importar',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    AnimationFadeinUpDirective,
    AnimationFadeinLeftDirective,
    FormsModule
  ],
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.scss'],
})
export class ImportarComponent extends General {
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
  @Input() esBotonFinal: boolean;
  modalRef: any;

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
    this.modalRef.dismiss('Cross click');
  }

  descargarEjemploImportar() {
    this.activatedRoute.queryParams
      .pipe(
        switchMap((parametro) => {
          let fileUrl = `../../../../assets/ejemplos/modelo/${parametro.documento_clase}.xlsx`;

          return this.descargarArchivosService
            .comprobarArchivoExiste(fileUrl)
            .pipe(
              map((archivoExiste) => ({ archivoExiste, parametro })) // Devolvemos un objeto que contiene ambos
            );
        }),
        tap(({ archivoExiste, parametro }) => {
          // Accedemos a los parámetros aquí
          if (archivoExiste) {
            // Crear un enlace de descarga
            let fileUrl = `../../../../assets/ejemplos/modelo/${parametro.documento_clase}.xlsx`;
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = parametro.documento_clase;
            // Añadir el enlace al DOM y hacer clic en él para iniciar la descarga
            document.body.appendChild(link);
            link.click();
            // Eliminar el enlace del DOM
            document.body.removeChild(link);
          }
        })
      )
      .subscribe()
  }

  async guardarArchivo() {
    this.subirArchivo(await this.toBase64(this.inputFile));
  }

  subirArchivo(archivo_base64: string) {
    let ruta = localStorage.getItem('ruta')!;
    this.activatedRoute.queryParams
      .subscribe((parametros) => {
        let modelo = this.modelo.toLowerCase();


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

  descargarExcelError() {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      let nombreArchivo = `errores_${parametro.documento_clase}.xlsx`;

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

  archivoSeleccionado(event: any) {
    this.inputFile = event.target.files[0];
    const selectedFile = event.target.files[0];
    this.archivoNombre = selectedFile.name;
    this.changeDetectorRef.detectChanges();
  }
}
