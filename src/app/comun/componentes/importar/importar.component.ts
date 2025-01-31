import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { AnimationFadeInLeftDirective } from '@comun/directive/animation-fade-in-left.directive';
import { AnimationFadeInUpDirective } from '@comun/directive/animation-fade-in-up.directive';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { HttpService } from '@comun/services/http.service';
import { ImportarDetallesErrores } from '@interfaces/comunes/importar/importar-detalles-errores.interface';
import { ImportarDetalles } from '@interfaces/comunes/importar/importar-detalles.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { obtenerArchivoImportacionLista } from '@redux/selectors/archivo-importacion.selectors';
import { saveAs } from 'file-saver';
import { catchError, mergeMap, of, take, tap, toArray } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-importar',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    AnimationFadeInUpDirective,
    AnimationFadeInLeftDirective,
    FormsModule,
  ],
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.scss'],
})
export class ImportarComponent extends General {
  archivoNombre: string = '';
  archivo_base64: string = '';
  archivoPeso: string = '';
  errorImportar: any[] = [];
  inputFile: any = null;
  cargardoDocumento: boolean = false;
  importarSoloNuevos: boolean = false;
  habilitarBtnEjemploImportar: boolean = false;
  soloNuevos: boolean;
  cantidadErrores: number = 0;
  modalRef: any;
  nombreArchivoEjemplo: string | null;
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
    this.store
      .select(obtenerArchivoImportacionLista)
      .pipe(
        tap((archivoImportacionLista) => {
          if (archivoImportacionLista) {
            this.nombreArchivoEjemplo = archivoImportacionLista;
            this.habilitarBtnEjemploImportar = true;
            this.changeDetectorRef.detectChanges();
          } else {
            this.nombreArchivoEjemplo = null;
            this.habilitarBtnEjemploImportar = false;
            this.changeDetectorRef.detectChanges();
          }
        }),
        tap(() => {
          this.importarSoloNuevos =
            this.parametrosUrl?.importarSoloNuevos === 'si' ? true : false;
          (this.soloNuevos = false), this.changeDetectorRef.detectChanges();
          this.archivoNombre = '';
          this.errorImportar = [];
          this.modalService.open(content, {
            ariaLabelledBy: 'modal-basic-title',
            backdrop: 'static',
            size: 'xl',
          });
        })
      )
      .subscribe()
      .unsubscribe();
  }

  cerrarModal() {
    this.modalRef.dismiss('Cross click');
  }

  descargarEjemploImportar() {
    if (this.nombreArchivoEjemplo) {
      this.descargarArchivosService
        .descargarArchivoLocal(
          `assets/ejemplos/modelo/${this.nombreArchivoEjemplo}`
        )
        .subscribe();
    }
  }

  async guardarArchivo() {
    this.subirArchivo(await this.toBase64(this.inputFile));
  }

  subirArchivo(archivo_base64: string) {
    let ruta = localStorage.getItem('ruta')!;

    this.activatedRoute.queryParams
      .subscribe((parametros) => {
        let modelo = this.modelo.toLowerCase();
        let nombreFiltro = `documento_${parametros.itemNombre?.toLowerCase()}`;
        let filtroPermamente: any = [];
        this.cargardoDocumento = true;
        this.changeDetectorRef.detectChanges();
        let url = `${ruta.toLowerCase()}/${modelo}/importar/`;

        let data: any = {
          archivo_base64,
          documento_tipo_id: Number(parametros?.documento_clase),
        };

        if (this.soloNuevos) {
          data['solo_nuevos'] = this.soloNuevos;
        }

        const filtroPermanenteStr = localStorage.getItem(
          `${nombreFiltro}_filtro_importar_fijo`
        );
        if (filtroPermanenteStr !== null) {
          filtroPermamente = JSON.parse(filtroPermanenteStr);
          Object.keys(filtroPermamente).forEach((key) => {
            const filtro = filtroPermamente[key];
            data[filtro.propiedad] = filtro.valor1;
          });
        }

        // TODO: Refactor
        this.httpService
          .post<ImportarDetalles>('general/documento/importar/', data)
          .pipe(
            tap((respuesta) => {
              this.alertaService.mensajaExitoso(
                `Se guardo la información registros importados: ${respuesta.registros_importados}`
              );
              this.soloNuevos = false;
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
    this.archivoPeso = (selectedFile.size / 1024).toFixed(2) + ' KB';
    this.changeDetectorRef.detectChanges();
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
