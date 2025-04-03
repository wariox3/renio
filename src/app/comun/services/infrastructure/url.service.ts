import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  // Nuestras URLs se construyen con /modulo/funcionalidad/modelo
  obtenerPathBase(url: string, funcionalidadSplit: string) {
    const segments = url.split(funcionalidadSplit);

    if (segments.length > 1) {
      return segments[0];
    }

    return '';
  }

  obtenerModuloPath(url: string) {
    return url.split('/')[1];
  }

  obtenerFuncionalidadPath(url: string) {
    return url.split('/')[2];
  }
}
