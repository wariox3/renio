import { inject, Injectable, signal } from '@angular/core';
import { GeneralService } from '@comun/services/general.service';
import { Filtros } from '@interfaces/comunes/componentes/filtros/filtros.interface';
import { GenDocumentoDetalle } from '@interfaces/general/documento-detalle.interface';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalDocumentoReferenciaService {
  private readonly _generalService = inject(GeneralService);
  private readonly _parametrosConsulta = signal({
    limit: 50,
  });
  private readonly _filtrosPermanentes = signal<Filtros[]>([]);

  public cantidadRegistros = signal(0);
  public registrosSeleccionados = signal<number[]>([]);
  public totalGeneral = signal(0);
  public lista = signal<GenDocumentoDetalle[]>([]);

  public consultarLista() {
    return this._generalService
      .consultaApi(
        'general/documento/',
        this._parametrosConsulta(),
      )
      .pipe(
        tap((respuesta: any) => {
          this.cantidadRegistros.set(respuesta.count);
          this.lista.set(respuesta.results);
        }),
      );
  }

  public initParametrosConsulta(documentoReferenciaId: number) {
    this._parametrosConsulta.update((parametros) => ({
      ...parametros,
      'documento_referencia_id': documentoReferenciaId,
    }));
  }

  public reiniciarFiltros() {
    // this._parametrosConsulta.update((parametros) => {
    //   return {
    //     ...parametros,
    //     filtros: this._filtrosPermanentes(),
    //   };
    // });
  }
  public actualizarFiltrosParametros(filtros: Filtros[]) {
    // this._parametrosConsulta.update((parametros) => ({
    //   ...parametros,
    //   filtros: [...parametros.filtros, ...filtros],
    // }));
  }

  public actualizarPaginacion(data: {
    desplazamiento: number;
    limite: number;
  }) {
    this._parametrosConsulta.update((parametros) => ({
      ...parametros,
      limite: data.desplazamiento,
      desplazar: data.limite,
    }));
  }

  public aplicarFiltros(filtros: Filtros[]) {
    if (filtros.length >= 1) {
      this.reiniciarFiltros();
      this.actualizarFiltrosParametros(filtros);
    } else {
      this.reiniciarFiltros();
    }
  }

  public cambiarDesplazamiento(desplazamiento: number) {
    this._parametrosConsulta.update((parametros) => ({
      ...parametros,
      desplazar: desplazamiento,
    }));
  }

  get getParametrosConsular() {
    return this._parametrosConsulta();
  }
}
