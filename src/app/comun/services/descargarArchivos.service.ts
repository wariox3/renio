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
      //.subscribe((data) => {
        // const blob = new Blob([data], { type: 'application/ms-excel' });
        // const url = window.URL.createObjectURL(blob);
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = `${this.activatedRoute.snapshot.queryParams['modelo']}.xlsx`;
        // a.id = 'descargaExcel'; // Asignar un ID único
        // document.body.appendChild(a);
        // a.click();
        // window.URL.revokeObjectURL(url);
        // // Remover el elemento <a> después de un breve tiempo
        // setTimeout(() => {
        //   const elementoDescarga = document.getElementById('descargaExcel');
        //   if (elementoDescarga) {
        //     document.body.removeChild(elementoDescarga);
        //   }
        // }, 100);
      //});
  }
}
