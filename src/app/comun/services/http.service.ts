import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subdomino } from './subdomino';


@Injectable({
  providedIn: 'root'
})
export class HttpService extends Subdomino  {

  constructor(private http: HttpClient) {
    super();
  }

   // Método GET
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
  public delete(endpoint: string): Observable<any> {
    const url = `${this.urlSubDominio}/${endpoint}`;
    return this.http.delete(url);
  }
}
