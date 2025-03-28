import { inject } from '@angular/core';
import { environment } from '@env/environment';
import { Store } from '@ngrx/store';
import { obtenerContenedorSubdominio } from '@redux/selectors/contenedor.selectors';

export class Subdominio {
  private readonly _store = inject(Store);
  private readonly URL_API_PLANTILLA = environment.URL_API_SUBDOMINIO;
  protected API_SUBDOMINIO: string = environment.URL_API_SUBDOMINIO;
  protected URL_API_BASE: string = environment.URL_API_MUUP;
  protected CONTENEDOR_NOMBRE: string;

  constructor() {
    this._store.select(obtenerContenedorSubdominio).subscribe((respuesta) => {
      this.API_SUBDOMINIO = this.URL_API_PLANTILLA.replace(
        'subdominio',
        respuesta,
      );
      this.CONTENEDOR_NOMBRE = respuesta;
    });
  }
}
