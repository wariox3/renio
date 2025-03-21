import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { ArchivosService } from '@comun/services/archivos/archivos.service';
import { ProcesadorArchivosService } from '@comun/services/archivos/procesador-archivos.service';
import { GeneralService } from '@comun/services/general.service';
import { Filtros } from '@interfaces/comunes/componentes/filtros/filtros.interface';
import { ArchivoRespuesta } from '@interfaces/comunes/lista/archivos.interface';
import { TamanoArchivoPipe } from '@pipe/tamano-archivo.pipe';
import { BehaviorSubject, finalize } from 'rxjs';

@Component({
  selector: 'app-cargar-archivos',
  standalone: true,
  imports: [TamanoArchivoPipe, CommonModule],
  templateUrl: './cargar-archivos.component.html',
  styleUrl: './cargar-archivos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CargarArchivosComponent extends General implements OnInit {
  private readonly _generalService = inject(GeneralService);
  private readonly _archivosService = inject(ArchivosService);
  private readonly _procesadorArchivosService = inject(
    ProcesadorArchivosService,
  );

  public listaArchivos: ArchivoRespuesta[] = [];
  public estadosBotonEliminar$ = new BehaviorSubject<boolean[]>([]);
  public subiendoArchivo$ = new BehaviorSubject<boolean>(false);

  @Input() documentoId: number | null = null;
  @Input({ required: true }) archivoTipo: number = 1;
  @Input() modeloNombre: string | null = null;
  @Input() codigo: number | null = null;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this._consultarArchivos();
  }

  descargarArchivo(archivo: ArchivoRespuesta) {
    this._archivosService.descargarArchivoGeneral({
      id: archivo.id,
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

  private _eliminarArchivo(archivoId: number, index: number) {
    this._toggleEstadoBotonEliminarPorIndex(index);
    this._archivosService
      .eliminarArchivoGeneral({ id: archivoId })
      .pipe(
        finalize(() => {
          this._toggleEstadoBotonEliminarPorIndex(index);
        }),
      )
      .subscribe({
        next: () => {
          this._eliminarPosicionBotonesEliminar(index);
          this._consultarArchivos();
          this.alertaService.mensajaExitoso(
            'El archivo se eliminó correctamente!',
          );
        },
      });
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
      (_, i) => i !== index,
    );
    this.estadosBotonEliminar$.next(estados);
  }

  private _limpiarBotonesEliminar() {
    this.estadosBotonEliminar$.next([]);
  }

  private _agregarEstadoABotonesEliminar() {
    const estados = [...this.estadosBotonEliminar$.value, false];
    this.estadosBotonEliminar$.next(estados);
  }

  private _consultarArchivos() {
    let filtros: Filtros[] = [];

    if (this.documentoId) {
      filtros = [
        ...filtros,
        {
          propiedad: 'documento_id',
          valor1: this.documentoId,
        },
      ];
    } else if (this.codigo && this.modeloNombre) {
      filtros = [
        ...filtros,
        {
          propiedad: 'codigo',
          valor1: Number(this.codigo),
        },
        {
          propiedad: 'modelo',
          valor1: this.modeloNombre,
        },
      ];
    }

    this._generalService
      .consultarDatosAutoCompletar<ArchivoRespuesta>({
        modelo: 'GenArchivo',
        filtros: filtros,
      })
      .subscribe({
        next: (response) => {
          this._limpiarBotonesEliminar();
          this.listaArchivos = response.registros;

          this.listaArchivos.forEach(() =>
            this._agregarEstadoABotonesEliminar(),
          );

          this.changeDetectorRef.detectChanges();
        },
      });
  }

  cargarArchivo(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const name = file.name;

      if (this._isExtensionArchivoValido(file)) {
        this._procesadorArchivosService
          .convertToBase64(file)
          .then((base64) => {
            if (this.documentoId) {
              this._submitImagen(
                base64,
                name,
                this.codigo,
                this.modeloNombre,
                this.archivoTipo,
                this.documentoId,
              );
            } else {
              this._submitImagen(
                base64,
                name,
                this.codigo,
                this.modeloNombre,
                this.archivoTipo,
                this.documentoId,
              );
            }
          })
          .catch((error) => {
            console.error('Error al procesar el archivo:', error);
          });
      } else {
        this.alertaService.mensajeError(
          'Extensión no permitida',
          'Solo se permiten archivos con extensiones .png, .jpg y .jpeg.',
        );
      }
    }
  }

  private _isExtensionArchivoValido(file: File): boolean {
    if (this.archivoTipo === 2) {
      const allowedExtensions = /(\.png|\.jpg|\.jpeg)$/i;
      if (!allowedExtensions.exec(file.name)) {
        return false;
      }
    }

    return true;
  }

  private _submitImagen(
    base64: string,
    nombreArchivo: string,
    codigo: number | null,
    modelo: string | null,
    archivoTipoId: number,
    documentoId: number | null,
  ) {
    this.subiendoArchivo$.next(true);
    this._archivosService
      .cargarArchivoImagen({
        modelo,
        archivoBase64: base64,
        nombreArchivo,
        codigo,
        archivoTipoId,
        documentoId,
      })
      .pipe(
        finalize(() => {
          this.subiendoArchivo$.next(false);
        }),
      )
      .subscribe({
        next: () => {
          this._consultarArchivos();
          this.alertaService.mensajaExitoso(
            'La imagen se ha cargado exitosamente!',
          );
        },
      });
  }
}
