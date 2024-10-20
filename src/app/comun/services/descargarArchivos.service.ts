import { Injectable, inject } from '@angular/core';
import { HttpService } from './http.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DescargarArchivosService {
  private httpService = inject(HttpService);
  private activatedRoute = inject(ActivatedRoute);
  private httpClient = inject(HttpClient);

  constructor() {}

  descargarExcelDocumentos(arrParametrosConsulta: any) {
    this.httpService.descargarArchivo(
      'general/funcionalidad/lista/',
      arrParametrosConsulta
    );
  }

  descargarExcelAdminsitrador(modelo: string, arrParametrosConsulta: any) {
    this.httpService.descargarArchivo(
      `general/funcionalidad/lista/`,
      arrParametrosConsulta
    );
  }

  descargarExcelDocumentoDetalle(arrParametrosConsulta: any) {
    this.httpService.descargarArchivo(
      'general/documento_detalle/excel/',
      arrParametrosConsulta
    );
  }

  comprobarArchivoExiste(fileUrl: string) {
    return this.httpClient.head(fileUrl, { observe: 'response' }).pipe(
      catchError((err) => {
        // Si hay un error, retorna false
        return of(false);
      })
    );
  }

  descargarArchivoLocal(fileUrl: string) {
    return this.comprobarArchivoExiste(fileUrl).pipe(
      tap((archivoExiste) => {
        const fileName = fileUrl.split('/');
        // Accedemos a los parámetros aquí
        if (archivoExiste) {
          // Crear un enlace de descarga
          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = fileName[fileName.length - 1];
          // Añadir el enlace al DOM y hacer clic en él para iniciar la descarga
          document.body.appendChild(link);
          link.click();
          // Eliminar el enlace del DOM
          document.body.removeChild(link);
          return true
        }
      })
    );
  }
}
