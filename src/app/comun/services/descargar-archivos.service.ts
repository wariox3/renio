import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { HttpService } from './http.service';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';

@Injectable({
  providedIn: 'root',
})
export class DescargarArchivosService {
  private httpService = inject(HttpService);
  private httpClient = inject(HttpClient);
  private _filterTransformerService = inject(FilterTransformerService);

  constructor() {}

  descargarExcel(arrParametrosConsulta: any, url: string) {
    this.httpService.descargarArchivo(url, arrParametrosConsulta);
  }

  exportarExcel(endpoint: string, queries: { [key: string]: any }) {
    const query = this._filterTransformerService.toQueryString({
      ...queries,
    });

    this.httpService.descargarArchivoPorGet(
      `${endpoint}/?excel=1${query ? `&${query}` : ''}`,
    );
  }

  exportarExcelPersonalizado(endpoint: string, queries: { [key: string]: any }) {
    const query = this._filterTransformerService.toQueryString({
      ...queries,
    });

    this.httpService.descargarArchivoPorGet(
      `${endpoint}/${query ? `?${query}` : ''}`,
    );
  }

  descargarZipDocumentos(arrParametrosConsulta: any) {

  }

  descargarExcelAdminsitrador(modelo: string, arrParametrosConsulta: any) {

  }

  descargarExcelDocumentoDetalle(arrParametrosConsulta: any) {
    this.httpService.descargarArchivo(
      'general/documento_detalle/excel/',
      arrParametrosConsulta,
    );
  }

  comprobarArchivoExiste(fileUrl: string) {
    return this.httpClient.head(fileUrl, { observe: 'response' }).pipe(
      catchError((err) => {
        // Si hay un error, retorna false
        return of(false);
      }),
    );
  }

  descargarArchivoLocal(
    fileUrl: string,
    descargarConNombrePersonalizado?: string,
  ) {
    return this.comprobarArchivoExiste(fileUrl).pipe(
      tap((archivoExiste) => {
        let nombreArchivo: string[] | string = fileUrl.split('/');
        nombreArchivo = nombreArchivo[nombreArchivo.length - 1];
        if (descargarConNombrePersonalizado !== undefined) {
          nombreArchivo = descargarConNombrePersonalizado;
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
      }),
    );
  }

  _construirNombreArchivo(
    parametro: any,
    ubicacion: string,
    detalle: string | undefined,
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
