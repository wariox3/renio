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
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { DocumentoService } from '@comun/services/documento/documento.service';
import { GeneralService } from '@comun/services/general.service';
import { Modelo } from '@comun/type/modelo.type';
import { RegistroAutocompletarConMovimiento } from '@interfaces/comunes/autocompletar/contabilidad/con-movimiento.interface';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { TablaComponent } from '../tabla/tabla.component';
import { ProcesadorArchivosService } from '@comun/services/archivos/procesador-archivos.service';
import { ArchivosService } from '@comun/services/archivos/archivos.service';
import { ArchivoRespuesta } from '@interfaces/comunes/lista/archivos.interface';
import { BehaviorSubject, finalize } from 'rxjs';

@Component({
  selector: 'app-comun-documento-opciones',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule, TablaComponent],
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

  @Input() opcionesDesaprobarBoton: {
    deshabilitado: boolean;
  };
  @Input({ required: true }) opciones: {
    modelo: Modelo;
  } = {
    modelo: 'ConMovimiento',
  };

  @Output() itemDesaprobadoEvent: EventEmitter<void>;

  constructor() {
    super();
    this.itemDesaprobadoEvent = new EventEmitter();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.documentoId = parametro.detalle;
    });
  }

  private _abirModal(content: any) {
    this._modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
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
          this.listaArchivos = response.registros;
          this.changeDetectorRef.detectChanges();
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
