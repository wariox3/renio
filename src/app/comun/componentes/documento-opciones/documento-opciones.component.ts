import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { documentos } from '@comun/extra/mapeo-entidades/documentos';
import { ArchivosService } from '@comun/services/archivos/archivos.service';
import { ProcesadorArchivosService } from '@comun/services/archivos/procesador-archivos.service';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { DocumentoService } from '@comun/services/documento/documento.service';
import { GeneralService } from '@comun/services/general.service';
import { Modelo } from '@comun/type/modelo.type';
import { RegistroAutocompletarConMovimiento } from '@interfaces/comunes/autocompletar/contabilidad/con-movimiento.interface';
import { ArchivoRespuesta } from '@interfaces/comunes/lista/archivos.interface';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TamanoArchivoPipe } from '@pipe/tamano-archivo.pipe';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { BehaviorSubject, finalize } from 'rxjs';
import { TablaComponent } from '../tabla/tabla.component';

@Component({
  selector: 'app-comun-documento-opciones',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule, TablaComponent, TamanoArchivoPipe],
  templateUrl: './documento-opciones.component.html',
  styleUrl: './documento-opciones.component.scss',
})
export class DocumentoOpcionesComponent extends General implements OnInit {
  private readonly _modalService = inject(NgbModal);
  private readonly _generalService = inject(GeneralService);
  private readonly _descargarArchivosService = inject(DescargarArchivosService);
  private readonly _documentoService = inject(DocumentoService);
  private readonly _archivosService = inject(ArchivosService);
  private readonly _procesadorArchivosService = inject(
    ProcesadorArchivosService
  );

  public arrDocumentos: any[];
  public cantidadRegistros: number;
  public listaArchivos: ArchivoRespuesta[] = [];
  public subiendoArchivo$ = new BehaviorSubject<boolean>(false);
  public documentoId: number;
  public estadosBotonEliminar$ = new BehaviorSubject<boolean[]>([]);

  @Input() opcionesDesaprobarBoton: {
    deshabilitado: boolean;
  };
  @Input({ required: true }) opciones: {
    modelo: Modelo;
  } = {
    modelo: 'ConMovimiento',
  };
  @Input({ required: true }) documento: any;

  @Output() itemDesaprobadoEvent: EventEmitter<void>;
  @Output() recargarDatosEvent: EventEmitter<void>;

  constructor() {
    super();
    this.itemDesaprobadoEvent = new EventEmitter();
    this.recargarDatosEvent = new EventEmitter();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.documentoId = parametro.detalle;
    });
  }

  private _agregarEstadoABotonesEliminar() {
    const estados = [...this.estadosBotonEliminar$.value, false];
    this.estadosBotonEliminar$.next(estados);
  }

  private _toggleEstadoBotonEliminarPorIndex(index: number) {
    const estados = [...this.estadosBotonEliminar$.value];
    if (index >= 0 && index < estados.length) {
      estados[index] = !estados[index];
      this.estadosBotonEliminar$.next(estados);
    }
  }

  private _eliminarPosicionBotonesEliminar(index: number) {
    const estados = this.estadosBotonEliminar$.value.filter(
      (_, i) => i !== index
    );
    this.estadosBotonEliminar$.next(estados);
  }

  private _limpiarBotonesEliminar() {
    this.estadosBotonEliminar$.next([]);
  }

  getEstadosBotonEliminar$() {
    return this.estadosBotonEliminar$.asObservable();
  }

  private _abirModal(content: any) {
    this._modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
  }

  private _consultarArchivos() {
    this._generalService
      .consultarDatosAutoCompletar<ArchivoRespuesta>({
        modelo: 'GenArchivo',
        filtros: [
          {
            propiedad: 'documento_id',
            valor1: this.documentoId,
          },
        ],
      })
      .subscribe({
        next: (response) => {
          this._limpiarBotonesEliminar();
          this.listaArchivos = response.registros;

          this.listaArchivos.forEach(() =>
            this._agregarEstadoABotonesEliminar()
          );

          this.changeDetectorRef.detectChanges();
        },
      });
  }

  private _submitArchivo(
    base64: string,
    nombreArchivo: string,
    documentoId: number
  ) {
    this.subiendoArchivo$.next(true);
    this._archivosService
      .cargarArchivoGeneral({
        archivoBase64: base64,
        nombreArchivo,
        documentoId,
      })
      .pipe(
        finalize(() => {
          this.subiendoArchivo$.next(false);
        })
      )
      .subscribe({
        next: () => {
          this._consultarArchivos();
          this.alertaService.mensajaExitoso(
            'El archivo se ha cargado exitosamente!'
          );
        },
      });
  }

  cargarArchivo(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const name = file.name;

      // Usamos el servicio para convertir el archivo a Base64
      this._procesadorArchivosService
        .convertToBase64(file)
        .then((base64) => {
          this._submitArchivo(base64, name, this.documentoId);
        })
        .catch((error) => {
          console.error('Error al procesar el archivo:', error);
        });
    }
  }

  descargarArchivo(archivo: ArchivoRespuesta) {
    this._archivosService.descargarArchivoGeneral({
      id: archivo.id,
    });
  }

  abrirModalContabilidad(content: any) {
    this._consultarInformacionTabla();
    this._cargarDatosMapeo(this.opciones.modelo);
    this._abirModal(content);
  }

  abrirModalArchivos(content: any) {
    this._consultarArchivos();
    this._abirModal(content);
  }

  descargarExcel() {
    this._descargarArchivosService.descargarExcelAdminsitrador('', {
      filtros: [
        {
          propiedad: 'documento_id',
          valor1: this.documentoId,
        },
      ],
      modelo: this.opciones.modelo,
      excel: true,
      limite: 5000,
    });
  }

  confirmarEliminarArchivo(id: number, index: number) {
    this.alertaService
      .confirmar({
        titulo: '¿Estas seguro de eliminar?',
        texto: 'Esta acción no se puede revertir.',
        textoBotonCofirmacion: 'Si, eliminar',
      })
      .then((respuesta) => {
        if (respuesta.isConfirmed) {
          this._eliminarArchivo(id, index);
        }
      });
  }

  confirmarDesaprobarDocumento() {
    this.alertaService
      .confirmar({
        titulo: '¿Estas seguro de desaprobar?',
        texto: '',
        textoBotonCofirmacion: 'Si, desaprobar',
      })
      .then((respuesta) => {
        if (respuesta.isConfirmed) {
          this._desaprobarDocumento(this.documentoId);
        }
      });
  }

  contabilizar() {
    this._documentoService.contabilizar({ id: this.documento.id }).subscribe({
      next: () => {
        this.itemDesaprobadoEvent.emit();
      },
    });
  }

  descontabilizar() {
    this._documentoService
      .descontabilizar({ id: this.documento.id })
      .subscribe({
        next: () => {
          this.itemDesaprobadoEvent.emit();
        },
      });
  }

  private _eliminarArchivo(archivoId: number, index: number) {
    this._toggleEstadoBotonEliminarPorIndex(index);
    this._archivosService
      .eliminarArchivoGeneral({ id: archivoId })
      .pipe(
        finalize(() => {
          this._toggleEstadoBotonEliminarPorIndex(index);
        })
      )
      .subscribe({
        next: () => {
          this._eliminarPosicionBotonesEliminar(index);
          this._consultarArchivos();
          this.alertaService.mensajaExitoso(
            'El archivo se eliminó correctamente!'
          );
        },
      });
  }

  private _desaprobarDocumento(documentoId: number) {
    this._documentoService.desaprobarDocumento({ id: documentoId }).subscribe({
      next: () => {
        this.alertaService.mensajaExitoso('Documento desaprobado con exito!');
        this.itemDesaprobadoEvent.emit();
      },
    });
  }

  private _cargarDatosMapeo(modelo: string) {
    this.store.dispatch(ActualizarMapeo({ dataMapeo: documentos[modelo] }));
  }

  private _consultarInformacionTabla() {
    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarConMovimiento>({
        filtros: [
          {
            propiedad: 'documento_id',
            valor1: this.documentoId,
          },
        ],
        modelo: this.opciones.modelo,
      })
      .subscribe((respuesta) => {
        this.arrDocumentos = respuesta.registros.map((documento) => ({
          id: documento.id,
          fecha: documento.fecha,
          numero: documento.numero,
          contacto_nombre_corto: documento.contacto_nombre_corto,
          comprobante: documento.comprobante_nombre,
          cuenta: documento.cuenta_codigo,
          grupo: documento.grupo_nombre,
          base: documento.base,
          debito: documento.debito,
          credito: documento.credito,
        }));
      });
  }
}
