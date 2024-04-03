import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class SubdominioService {

  private dominioActual = ""
  constructor() {
    this.dominioActual = window.location.host
  }

  esSubdominioActual() {
    return window.location.host.includes(environment.dominioApp);
  }

  subdominioNombre() {
    return this.dominioActual.split('.')[0];
  }
}
