import { Injectable, inject } from '@angular/core';
import { HttpService } from './http.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DescargarArchivosService {
  private httpService = inject(HttpService);
  private activatedRoute = inject(ActivatedRoute);
  private httpClient = inject(HttpClient);

  constructor() {}

  descargarExcelDocumentos(arrParametrosConsulta: any) {
    this.httpService
      .descargarArchivo('general/documento/excel/', arrParametrosConsulta)
  }

  descargarExcelAdminsitrador(modelo: string, arrParametrosConsulta: any ) {
    this.httpService
      .descargarArchivo(`general/${modelo.toLocaleLowerCase()}/excel/`, arrParametrosConsulta)
  }

  descargarExcelDocumentoDetalle(arrParametrosConsulta: any) {
    this.httpService
      .descargarArchivo('general/documento_detalle/excel/', arrParametrosConsulta)
  }

  comprobarArchivoExiste(fileUrl: string) {
    return this.httpClient.head(fileUrl, { observe: 'response' })
      .pipe(
        catchError(err => {
          // Si hay un error, retorna false
          return of(false);
        })
      );
  }
}
