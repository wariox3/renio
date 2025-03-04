import { inject, Injectable, signal } from '@angular/core';
import { DocumentoService } from '@comun/services/documento/documento.service';
import { GeneralService } from '@comun/services/general.service';
import { Filtros } from '@interfaces/comunes/componentes/filtros/filtros.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { GenDocumentoDetalle } from '@interfaces/general/documento-detalle.interface';
import { RespuestaContabilizarLista } from '@modulos/contabilidad/interfaces/contabilizar.interface';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalDocumentoDetallesService {
  private readonly _generalService = inject(GeneralService);
  private readonly _parametrosConsulta = signal<ParametrosFiltros>({
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 0,
    modelo: 'GenDocumentoDetalle',
    filtros: [],
  });
  private readonly _filtrosPermanentes = signal<Filtros[]>([]);

  public cantidadRegistros = signal(0);
  public registrosSeleccionados = signal<number[]>([]);
  public totalGeneral = signal(0);
  public lista = signal<GenDocumentoDetalle[]>([]);

  public consultarLista() {
    return this._generalService
      .consultarDatosAutoCompletar<GenDocumentoDetalle>(
        this._parametrosConsulta(),
      )
      .pipe(
        tap((respuesta) => {
          this.cantidadRegistros.set(respuesta.cantidad_registros);
          this.lista.set(respuesta.registros);
        }),
      );
  }

  public initParametrosConsulta(documentoAfectadoId: number) {
    this._parametrosConsulta.update((parametros) => ({
      ...parametros,
      filtros: [
        {
          propiedad: 'documento_afectado',
          operador: 'exact',
          valor1: documentoAfectadoId,
        },
      ],
    }));
  }

  public reiniciarFiltros() {
    this._parametrosConsulta.update((parametros) => {
      return {
        ...parametros,
        filtros: this._filtrosPermanentes(),
      };
    });
  }
  public actualizarFiltrosParametros(filtros: Filtros[]) {
    this._parametrosConsulta.update((parametros) => ({
      ...parametros,
      filtros: [...parametros.filtros, ...filtros],
    }));
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
