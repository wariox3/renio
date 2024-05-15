import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subdomino } from '@comun/clases/subdomino';
import { AlertaService } from './alerta.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService extends Subdomino {

  private alertaService = inject(AlertaService)

  constructor(private http: HttpClient) {
    super();
  }

  // Método GET detalle
  public getDetalle<T>(endpoint: string): Observable<T> {
    const url = `${this.urlSubDominio}/${endpoint}`;
    return this.http.get<T>(url);
  }

  // Método GET para listas
  public get<T>(endpoint: string): Observable<T[]> {
    const url = `${this.urlSubDominio}/${endpoint}`;
    return this.http.get<T[]>(url);
  }

  // Método POST
  public post<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.urlSubDominio}/${endpoint}`;
    return this.http.post<T>(url, data);
  }

  // Método PUT
  public put<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.urlSubDominio}/${endpoint}`;
    return this.http.put<T>(url, data);
  }

  // Método DELETE
  public delete(endpoint: string, data: any): Observable<any> {
    const url = `${this.urlSubDominio}/${endpoint}`;
    return this.http.delete(url, data);
  }

  public descargarArchivo(endpoint: string, data: any): void {
    const url = `${this.urlSubDominio}/${endpoint}`;
    this.alertaService.mensajaEspera('Cargando')
    this.http
      .post<HttpResponse<Blob>>(url, data, {
        observe: 'response',
        responseType: 'blob' as 'json',
      })
      .subscribe((response) => {
        if (response !== null) {
          const headers = response.headers as HttpHeaders;

          let nombreArchivo = headers
            .get('Content-Disposition')!
            .split(';')[1]
            .trim()
            .split('=')[1];
          nombreArchivo = decodeURI(nombreArchivo.replace(/"/g, ''));

          if (!nombreArchivo) {
            console.log('fileName error');
            return;
          }
          const data: any = response.body;

          if (data !== null) {
            const blob = new Blob([data], {
              type: data?.type,
            });
            const objectUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('style', 'display:none');
            a.setAttribute('href', objectUrl);
            a.setAttribute('download', nombreArchivo);
            a.click();
            URL.revokeObjectURL(objectUrl);
            setTimeout(() => this.alertaService.cerrarMensajes(), 1000)
          }
        }
      });
  }
}
