import { Injectable, inject } from '@angular/core';
import { HttpService } from './http.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { General } from '@comun/clases/general';

@Injectable({
  providedIn: 'root',
})
export class DescargarArchivosService {
  private httpService = inject(HttpService);
  private httpClient = inject(HttpClient);

  constructor() {}

  descargarExcelDocumentos(arrParametrosConsulta: any) {
    this.httpService.descargarArchivo(
      'general/funcionalidad/lista/',
      arrParametrosConsulta
    );
  }

  descargarExcel(arrParametrosConsulta: any, url: string) {
    this.httpService.descargarArchivo(
      url,
      arrParametrosConsulta
    );
  }

  descargarZipDocumentos(arrParametrosConsulta: any) {
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

  descargarArchivoLocal(fileUrl: string, descargarConNombrePersonalizado?: string) {
    return this.comprobarArchivoExiste(fileUrl).pipe(
      tap((archivoExiste) => {
        let nombreArchivo: string[] | string = fileUrl.split('/');
        nombreArchivo = nombreArchivo[nombreArchivo.length - 1]
        if(descargarConNombrePersonalizado !== undefined){
          nombreArchivo = descargarConNombrePersonalizado
        }
        // Accedemos a los parámetros aquí
        if (archivoExiste) {
          // Crear un enlace de descarga
          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = nombreArchivo;
          // Añadir el enlace al DOM y hacer clic en él para iniciar la descarga
          document.body.appendChild(link);
          link.click();
          // Eliminar el enlace del DOM
          document.body.removeChild(link);
          return true;
        }
      })
    );
  }

  _construirNombreArchivo(
    parametro: any,
    ubicacion: string,
    detalle: string | undefined
  ) {
    let nombreArchivo = '';

    if (ubicacion === 'administrador') {
      nombreArchivo = `${parametro.itemNombre}`;
    }

    if (ubicacion === 'documento') {
      nombreArchivo = `${parametro.documento_clase}`;
    }

    if (ubicacion === 'independiente') {
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

    if (detalle != undefined) {
      nombreArchivo = parametro.modelo;
    }

    return nombreArchivo;
  }
}
