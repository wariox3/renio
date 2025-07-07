import { inject, Injectable, signal } from '@angular/core';
import { DocumentoService } from '@comun/services/documento/documento.service';
import { GeneralService } from '@comun/services/general.service';
import { HttpService } from '@comun/services/http.service';
import { RespuestaContabilizarLista } from '@modulos/contabilidad/interfaces/contabilizar.interface';
import { tap } from 'rxjs';
import {
  ParametrosApi,
  RespuestaApi,
} from 'src/app/core/interfaces/api.interface';
import { FilterCondition } from 'src/app/core/interfaces/filtro.interface';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';

@Injectable({
  providedIn: 'root',
})
export class ContabilizarService {
  private readonly _generalService = inject(GeneralService);
  private readonly _filterTransformerService = inject(FilterTransformerService);
  private readonly _httpService = inject(HttpService);
  private readonly _documentoService = inject(DocumentoService);
  private readonly _parametrosConsulta = signal<ParametrosApi>({
    estado_contabilizado: 'False',
    estado_aprobado: 'True',
    documento_tipo__contabilidad: 'True',
  });
  private readonly _filtrosPermanentes = signal<ParametrosApi>({
    estado_contabilizado: 'False',
    estado_aprobado: 'True',
    documento_tipo__contabilidad: 'True',
  });

  public cantidadRegistros = signal(0);
  public registrosSeleccionados = signal<number[]>([]);
  public totalGeneral = signal(0);
  public contabilizarLista = signal<RespuestaContabilizarLista[]>([]);

  public consultarListaContabilizar() {
    return this._generalService
      .consultaApi<
        RespuestaApi<RespuestaContabilizarLista>
      >('general/documento/', this._parametrosConsulta())
      .pipe(
        tap((respuesta) => {
          this.cantidadRegistros.set(respuesta.count);
          this.contabilizarLista.set(respuesta.results);
        }),
      );
  }

  public reiniciarFiltros() {
    this._parametrosConsulta.update(() => {
      return this._filtrosPermanentes()
    });
  }

  public contabilizarTodos(ids: number[]) {
    return this._documentoService.contabilizar({ ids });
  }

  public actualizarFiltrosParametros(filtros: ParametrosApi) {
    this._parametrosConsulta.update((parametros) => ({
      ...parametros,
      ...filtros,
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

  public ejecutarContabilizarTodos() {
    return this.contabilizarTodos(this.registrosSeleccionados());
  }

  public aplicarFiltros(filtros: FilterCondition[]) {
    const parametros =
      this._filterTransformerService.transformToApiParams(filtros);

    this.reiniciarFiltros();

    if (filtros.length >= 1) {
      this.actualizarFiltrosParametros(parametros);
    }
  }

  public cambiarDesplazamiento(desplazamiento: number) {
    this._parametrosConsulta.update((parametros) => ({
      ...parametros,
      desplazar: desplazamiento,
    }));
  }

  public reiniciarRegistrosSeleccionados() {
    this.registrosSeleccionados.set([]);
  }

  public agregarTodosARegistrosSeleccionados() {
    this.contabilizarLista().forEach((registro) => {
      const indexItem = this.registrosSeleccionados().indexOf(registro.id);

      if (indexItem === -1) {
        this.registrosSeleccionados().push(registro.id);
      }
    });
  }

  public agregarIdARegistrosSeleccionados(id: number) {
    this.registrosSeleccionados().push(id);
  }

  public removerIdRegistrosSeleccionados(id: number) {
    const itemsFiltrados = this.registrosSeleccionados().filter(
      (item) => item !== id,
    );
    this.registrosSeleccionados.set(itemsFiltrados);
  }

  public idEstaEnLista(id: number): boolean {
    return this.registrosSeleccionados().indexOf(id) !== -1;
  }

  get getParametrosConsular() {
    return this._parametrosConsulta();
  }
}
