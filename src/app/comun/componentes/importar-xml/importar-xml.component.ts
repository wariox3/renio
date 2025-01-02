import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { AnimationFadeInLeftDirective } from '@comun/directive/animation-fade-in-left.directive';
import { AnimationFadeInUpDirective } from '@comun/directive/animation-fade-in-up.directive';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { HttpService } from '@comun/services/http.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import { mergeMap, of, take, toArray } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-importar-xml',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    AnimationFadeInUpDirective,
    AnimationFadeInLeftDirective,
    FormsModule,
  ],
  templateUrl: './importar-xml.component.html',
  styleUrl: './importar-xml.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportarXmlComponent  extends General {

  archivoNombre: string = '';
  archivo_base64: string = '';
  errorImportar: any[] = [];
  archivoPeso: string = '';
  inputFile: any = null;
  cargardoDocumento: boolean = false;
  importarSoloNuevos: boolean = false;
  inhabilitarBtnEjemploImportar: boolean = false;
  soloNuevos: boolean;
  modalRef: any;
  cantidadErrores: number = 0
  @Input() estadoHabilitado: boolean = false;
  @Input() modelo: string;
  @Input() esBotonFinal: boolean;
  @Output() emitirDetallesAgregados: EventEmitter<any> = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private httpService: HttpService,
    private descargarArchivosService: DescargarArchivosService
  ) {
    super();
  }

  abrirModalContactoNuevo(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'xl',
    });
  }

  removerArchivoSeleccionado() {
    this.archivoNombre = '';
  }

  async guardarArchivo() {
    this.subirArchivo(await this.toBase64(this.inputFile));
  }

  subirArchivo(archivo_base64: string) {
    // let ruta = localStorage.getItem('ruta')!;

    // this.activatedRoute.queryParams
    //   .subscribe((parametros) => {
    //     let modelo = this.modelo.toLowerCase();
    //     let nombreFiltro = `documento_${parametros.itemNombre?.toLowerCase()}`;
    //     let filtroPermamente: any = [];
    //     this.cargardoDocumento = true;
    //     this.changeDetectorRef.detectChanges();
    //     let url = `${ruta.toLowerCase()}/${modelo}/importar/`;

    //     let data: any = {
    //       archivo_base64,
    //     };

    //     if (this.soloNuevos) {
    //       data['solo_nuevos'] = this.soloNuevos;
    //     }

    //     const filtroPermanenteStr = localStorage.getItem(
    //       `${nombreFiltro}_filtro_importar_fijo`
    //     );
    //     if (filtroPermanenteStr !== null) {
    //       filtroPermamente = JSON.parse(filtroPermanenteStr);
    //       Object.keys(filtroPermamente).forEach((key) => {
    //         const filtro = filtroPermamente[key];
    //         data[filtro.propiedad] = filtro.valor1;
    //       });
    //     }

    //     this.httpService
    //       .post<ImportarDetalles>(url, data)
    //       .pipe(
    //         tap((respuesta) => {
    //           this.alertaService.mensajaExitoso(
    //             `Se guardo la información registros importados: ${respuesta.registros_importados}`
    //           );
    //           this.soloNuevos = false;
    //           this.modalService.dismissAll();
    //           this.errorImportar = [];
    //           this.cargardoDocumento = false;
    //           this.changeDetectorRef.detectChanges();
    //           this.emitirDetallesAgregados.emit(respuesta);
    //         }),
    //         catchError((respuesta: ImportarDetallesErrores) => {
    //           if (respuesta.errores_validador) {
    //              this.cantidadErrores = respuesta.errores_validador.length
    //              this._adaptarErroresImportar(respuesta.errores_validador);
    //           }
    //           this.cargardoDocumento = false;
    //           this.changeDetectorRef.detectChanges();
    //           return of(null);
    //         })
    //       )
    //       .subscribe();
    //   })
    //   .unsubscribe();
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

  descargarEjemploImportar() {
    const nombreArchivo = this.descargarArchivosService._construirNombreArchivo(
      this.parametrosUrl,
      this.ubicacion,
      undefined
    );

    this.descargarArchivosService
      .descargarArchivoLocal(`assets/ejemplos/modelo/${nombreArchivo}.xlsx`)
      .subscribe();
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
