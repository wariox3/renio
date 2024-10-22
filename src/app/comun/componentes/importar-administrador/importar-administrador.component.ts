import { DescargarArchivosService } from '@comun/services/descargarArchivos.service';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
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
import { catchError, of, Subject, switchMap, tap, takeUntil } from 'rxjs';
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
    FormsModule,
  ],
  templateUrl: './importar-administrador.component.html',
  styleUrl: './importar-administrador.component.scss',
})
export class ImportarAdministradorComponent
  extends General
  implements OnDestroy
{
  archivoNombre: string = '';
  archivo_base64: string = '';
  errorImportar: ErroresDato[] = [];
  inputFile: any = null;
  cargardoDocumento: boolean = false;
  importarSoloNuevos: boolean = false;
  soloNuevos: boolean;
  @Input() estadoHabilitado: boolean = false;
  @Input() detalle: any;
  @Input() modelo: string;
  @Input() filtrosExternos: any;
  @Output() emitirDetallesAgregados: EventEmitter<any> = new EventEmitter();
  private _unsubscribe$ = new Subject<void>();

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
        this.importarSoloNuevos =
          parametros.importarSoloNuevos === 'si' ? true : false;
        (this.soloNuevos = false), this.changeDetectorRef.detectChanges();
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
        let nombreFiltro = `documento_${parametros.itemNombre?.toLowerCase()}`;
        let filtroPermamente: any = [];

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

        let data: any = {
          archivo_base64,
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

        if (this.filtrosExternos !== undefined) {
          Object.keys(this.filtrosExternos).forEach((key) => {
            const filtro = this.filtrosExternos[key];
            data[filtro.propiedad] = filtro.valor1;
          });
        }

        if(this.detalle != undefined){
          Object.keys(this.detalle).forEach((key) => {
            const filtro = this.detalle[key];
            data[filtro.idNombre] = filtro.idValor;
          });
        }

        this.httpService
          .post<ImportarDetalles>(url, data)
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
      .pipe(
        takeUntil(this._unsubscribe$),
        tap((parametro) => {
          let nombreArchivo = '';
          if (this.ubicacion === 'administrador') {
            nombreArchivo = `${parametro.itemNombre}`;
          }
          if (this.ubicacion === 'independiente') {
            nombreArchivo = `${localStorage
              .getItem('ruta')!
              .substring(0, 1)
              .toUpperCase()}${localStorage
              .getItem('ruta')!
              .substring(1, 3)
              .toLocaleLowerCase()}${parametro.itemNombre[0].toUpperCase()}${parametro.itemNombre
              .substring(1, parametro.itemNombre.length)
              .toLocaleLowerCase()}`;
          }

          if(this.detalle != undefined){
            nombreArchivo = parametro.modelo
          }

          this.descargarArchivosService
            .descargarArchivoLocal(
              `assets/ejemplos/modelo/${nombreArchivo}.xlsx`
            )
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe();
        })
      )
      .subscribe()
      .unsubscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
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
