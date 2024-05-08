import { Injectable, inject } from '@angular/core';
import { HttpService } from './http.service';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DescargarArchivosService {
  private httpService = inject(HttpService);
  private activatedRoute = inject(ActivatedRoute);

  constructor() {}

  descargarExcelDocumentos(arrParametrosConsulta: any) {
    this.httpService
      .descargarArchivo('general/documento/excel/', arrParametrosConsulta)
  }

  descargarExcelAdminsitrador(modelo: string, arrParametrosConsulta: any ) {
    this.httpService
      .descargarArchivo(`general/${modelo.toLocaleLowerCase()}/excel/`, arrParametrosConsulta)
  }
}
