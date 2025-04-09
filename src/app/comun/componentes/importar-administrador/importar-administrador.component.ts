import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { AnimationFadeInLeftDirective } from '@comun/directive/animation-fade-in-left.directive';
import { AnimationFadeInUpDirective } from '@comun/directive/animation-fade-in-up.directive';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { HttpService } from '@comun/services/http.service';
import { ImportarDetallesErrores } from '@interfaces/comunes/importar/importar-detalles-errores.interface';
import { ImportarDetalles } from '@interfaces/comunes/importar/importar-detalles.interface';
import {
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import { catchError, mergeMap, of, Subject, take, tap, toArray } from 'rxjs';
import * as XLSX from 'xlsx';
import { maestros } from './constants/maestros.constant';

@Component({
  selector: 'app-importar-administrador',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    AnimationFadeInUpDirective,
    AnimationFadeInLeftDirective,
    FormsModule,
    NgbDropdownModule,
    NgbNavModule,
  ],
  templateUrl: './importar-administrador.component.html',
  styleUrl: './importar-administrador.component.scss',
})
export class ImportarAdministradorComponent
  extends General
  implements OnDestroy, OnInit
{
  active: number = 1;
  archivoNombre: string = '';
  archivo_base64: string = '';
  archivoPeso: string = '';
  errorImportar: any[] = [];
  inputFile: any = null;
  cargardoDocumento = signal<boolean>(false);
  importarSoloNuevos: boolean = false;
  soloNuevos: boolean;
  habilitarBtnEjemploImportar: boolean = false;
  cantidadErrores: number = 0;
  public maestros = maestros;
  public alias: string;
  @Input() importarConfig: {
    endpoint: string;
    nombre: string | undefined;
    rutaEjemplo: string | undefined;
    verBotonImportar: boolean | undefined;
    verBotonEjemplo: boolean | undefined;
  };
  @Input() habilitarBotonImportar: boolean;
  @Input() verBotonEjemplo: boolean;
  @Input() estadoHabilitado: boolean = false;
  @Input() detalle: any;
  @Input() modelo: string;
  @Input() filtrosExternos: any;
  @Input() exportarArchivoFijo: string;
  @Output() emitirDetallesAgregados: EventEmitter<any> = new EventEmitter();
  private _unsubscribe$ = new Subject<void>();

  constructor(
    private modalService: NgbModal,
    private httpService: HttpService,
    private descargarArchivosService: DescargarArchivosService,
  ) {
    super();
  }

  ngOnInit(): void {}

  abrirModalContactoNuevo(content: any) {
    // this.descargarArchivosService._construirNombreArchivo(
    //   this.parametrosUrl,
    //   this.ubicacion,
    //   this.detalle,
    // );

    this.archivoNombre = '';
    this.errorImportar = [];
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'xl',
    });
    // if (this.detalle) {
    //   this.store
    //     .select(obtenerArchivoImportacionDetalle)
    //     .pipe(
    //       tap((archivoImportacionLista) => {
    //         if (archivoImportacionLista) {
    //           this.habilitarBtnEjemploImportar = true;
    //           this.changeDetectorRef.detectChanges();
    //         } else {
    //           this.habilitarBtnEjemploImportar = false;
    //           this.changeDetectorRef.detectChanges();
    //         }
    //       }),
    //       tap(() => {
    //         // this._cargarMaestros();
    //         // this.importarSoloNuevos =
    //         //   this.parametrosUrl?.importarSoloNuevos === 'si' ? true : false;
    //         // (this.soloNuevos = false), this.changeDetectorRef.detectChanges();
    //         this.archivoNombre = '';
    //         this.errorImportar = [];
    //         this.modalService.open(content, {
    //           ariaLabelledBy: 'modal-basic-title',
    //           backdrop: 'static',
    //           size: 'xl',
    //         });
    //       }),
    //     )
    //     .subscribe()
    //     .unsubscribe();
    // } else {
    //   this.store
    //     .select(obtenerArchivoImportacionLista)
    //     .pipe(
    //       tap((archivoImportacionLista) => {
    //         if (archivoImportacionLista) {
    //           this.habilitarBtnEjemploImportar = true;
    //           this.changeDetectorRef.detectChanges();
    //         } else {
    //           this.habilitarBtnEjemploImportar = false;
    //           this.changeDetectorRef.detectChanges();
    //         }
    //       }),
    //       tap(() => {
    //         // this._cargarMaestros();
    //         // this.importarSoloNuevos =
    //         //   this.parametrosUrl?.importarSoloNuevos === 'si' ? true : false;
    //         // (this.soloNuevos = false), this.changeDetectorRef.detectChanges();
    //         this.archivoNombre = '';
    //         this.errorImportar = [];
    //         this.modalService.open(content, {
    //           ariaLabelledBy: 'modal-basic-title',
    //           backdrop: 'static',
    //           size: 'xl',
    //         });
    //       }),
    //     )
    //     .subscribe()
    //     .unsubscribe();
    // }
  }

  // maestros son los botones del dropdown que permiten descargar acrhivos del S3
  // private _cargarMaestros() {
  //   this._menuReducerService
  //     .getModuloItemInformacion(this.moduloNombre, this.alias)
  //     .subscribe({
  //       next: (categoriaItem) => {
  //         // con esto obtenemos la informacion precisa del item en el que estemos parados
  //         this._cargarInformacionMaestros(categoriaItem);
  //       },
  //     });
  // }

  // //
  // private _cargarInformacionMaestros(
  //   categoriaItem: informacionMenuItem | undefined | null,
  // ) {
  //   if (!categoriaItem || !categoriaItem.maestros) {
  //     this.maestros = [];
  //     return;
  //   }

  //   this.maestros = categoriaItem.maestros;
  // }

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

  subirArchivo(archivo_base64: string) {
    this.activatedRoute.queryParams
      .subscribe((parametros) => {
        let nombreFiltro = `documento_${this.importarConfig.nombre?.toLowerCase()}`;
        let filtroPermamente: any = [];
        this.cargardoDocumento.set(true);

        // let modelo = '';
        // let ruta = '';

        // if (this.modelo === 'MOVIMIENTO') {
        //   modelo = 'movimiento';
        //   ruta = localStorage.getItem('ruta')!;
        // } else {
        //   if ('no' == 'no') {
        //     if (this.accion === 'detalle') {
        //       modelo = this.modelo
        //         .toLowerCase()
        //         .substring(3, this.modelo.length);
        //       ruta = localStorage.getItem('ruta')!;
        //     } else {
        //       modelo = this.modelo
        //         .toLowerCase()
        //         .substring(3, this.modelo.length);
        //       ruta = this.modulo;
        //     }
        //   } else {
        //     ruta = localStorage.getItem('ruta')!;
        //     modelo = this.modelo.toLowerCase().substring(3, this.modelo.length);
        //   }
        // }

        // this.cargardoDocumento = true;
        // this.changeDetectorRef.detectChanges();
        // let url = `${ruta.toLowerCase()}/${modelo}/importar/`;

        let data: any = {
          archivo_base64,
        };

        if (this.soloNuevos) {
          data['solo_nuevos'] = this.soloNuevos;
        }

        const filtroPermanenteStr = localStorage.getItem(
          `${nombreFiltro}_filtro_importar_fijo`,
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

        if (this.detalle != undefined) {
          Object.keys(this.detalle).forEach((key) => {
            const filtro = this.detalle[key];
            data[filtro.idNombre] = filtro.idValor;
          });
        }

        this.httpService
          .post<ImportarDetalles>(
            `${this.importarConfig.endpoint}/importar/`,
            data,
          )
          .pipe(
            tap((respuesta) => {
              this.alertaService.mensajaExitoso(
                `Se guardo la información registros importados: ${respuesta.registros_importados}`,
              );
              this.soloNuevos = false;
              this.modalService.dismissAll();
              this.errorImportar = [];
              this.cargardoDocumento.set(false);
              this.changeDetectorRef.detectChanges();
              this.emitirDetallesAgregados.emit(respuesta);
            }),
            catchError((respuesta: ImportarDetallesErrores) => {
              if (respuesta.errores_validador) {
                this.cantidadErrores = respuesta.errores_validador.length;
                this._adaptarErroresImportar(respuesta.errores_validador);
              }
              this.cargardoDocumento.set(false);
              this.changeDetectorRef.detectChanges();
              return of(null);
            }),
          )
          .subscribe();
      })
      .unsubscribe();
  }

  descargarExcelImportar() {
    // let nombreArchivo = this.importarConfig.nombre;

    // if (this.exportarArchivoFijo) {
    //   nombreArchivo = this.exportarArchivoFijo;
    // }

    this.descargarArchivosService
      .descargarArchivoLocal(this.importarConfig.rutaEjemplo || '')
      .subscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  descargarExcelError() {
    this.activatedRoute.queryParams
      .subscribe((parametro) => {
        let nombreArchivo = `errores_${this.importarConfig.nombre}.xlsx`;

        // if (esIndependite == 'si') {
        //   nombreArchivo = `errores_${localStorage
        //     .getItem('ruta')!
        //     .toLowerCase()
        //     .substring(
        //       0,
        //       3,
        //     )}_${parametro.itemNombre?.toLocaleLowerCase()}.xlsx`;
        // }
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
          this.errorImportar,
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
              }),
            ),
          ),
        ),
        take(100), // Limita la cantidad de errores procesados a 100
        toArray(),
      )
      .subscribe((result) => {
        this.errorImportar = result;
      });
  }
}
