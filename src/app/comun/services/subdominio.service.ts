import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubdominioService {

  private dominioActual = ""
  constructor() {
    this.dominioActual = window.location.host
  }

  esSubdominioActual() {
    let esSubdominio = this.dominioActual.split('.').length > 2;
    return esSubdominio;
  }

  subdominioNombre() {
    return this.dominioActual.split('.')[0];
  }
}
