import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { General } from '@comun/clases/general';
import { AnimationFadeinUpDirective } from '@comun/Directive/AnimationFadeinUp.directive';
import { HttpService } from '@comun/services/http.service';
import { ErroresDato, ImportarDetalles, ImportarDetallesErrores } from '@interfaces/comunes/importar-detalles.';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-importar-detalles',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule, TranslateModule, AnimationFadeinUpDirective],
  templateUrl: './importar-detalles.component.html',
  styleUrl: './importar-detalles.component.scss',
})
export class ImportarDetallesComponent extends General {
  archivoNombre: string = '';
  archivo_base64: string = '';
  errorImportar: ErroresDato[] = []
  @Input() estadoHabilitado: boolean = false;
  @Output() z: EventEmitter<any> = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private httpService: HttpService
  ) {
    super();
  }

  abrirModalContactoNuevo(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
  }

  cerrarModal() {
    this.modalService.dismissAll();
  }

  async archivoSeleccionado(event: any) {
    const selectedFile = event.target.files[0];
    this.archivoNombre = selectedFile.name;

    const file: any = document.querySelector('#myfile');
    if (file) {
      this.subirArchivo(await this.toBase64(file.files[0]));
    }
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
    const { detalle: documento_id } = this.parametrosUrl;
    this.httpService
      .post('general/documento/importar-detalle/', {
        documento_id,
        archivo_base64,
      })
      .pipe(
        tap((respuesta) => {
          //console.log(respuesta);
          //this.emitirDetallesAgregados.
        }),
        catchError((respuesta: ImportarDetallesErrores) => {
          this.errorImportar = respuesta.errores_datos
          return of(null);
        })
      )
      .subscribe();
  }
}
