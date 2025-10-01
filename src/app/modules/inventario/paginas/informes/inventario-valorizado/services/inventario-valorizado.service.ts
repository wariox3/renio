import { inject, Injectable, signal } from '@angular/core';
import { GeneralService } from '@comun/services/general.service';
import { HttpService } from '@comun/services/http.service';
import { RespuestaContabilizarLista } from '@modulos/contabilidad/interfaces/contabilizar.interface';
import { finalize, forkJoin, tap } from 'rxjs';
import { ParametrosApi, RespuestaApi } from 'src/app/core/interfaces/api.interface';

@Injectable({
  providedIn: 'root',
})
export class InventarioValorizadoService {
  private readonly _generalService = inject(GeneralService);
  private readonly _httpService = inject(HttpService);
  private readonly _filtrosPermanentes = signal<ParametrosApi>({
    limit: 50,
    inventario: 'True',
    serializador: 'informe_inventario_valorizado',
  });
  private readonly _parametrosConsulta = signal<ParametrosApi>({
    ...this._filtrosPermanentes(),
  });

  public cantidadRegistros = signal(0);
  public registrosSeleccionados = signal<number[]>([]);
  public totalGeneral = signal(0);
  public contabilizarLista = signal<RespuestaContabilizarLista[]>([]);

  public consultarListaContabilizar() {
    return this._generalService
      .consultaApi<RespuestaApi<RespuestaContabilizarLista>>(
        'general/item/',
        this._parametrosConsulta(),
      )
      .pipe(
        tap((respuesta) => {
          this.cantidadRegistros.set(respuesta.count);
          this.contabilizarLista.set(respuesta.results);
        }),
      );
  }

  public reiniciarFiltros() {
    this._parametrosConsulta.set(this._filtrosPermanentes());
  }

  public contabilizarTodos(id: number) {
    return this._httpService.post('general/documento/contabilizar/', {
      id,
    });
  }

  public actualizarFiltrosParametros(filtros: ParametrosApi) {
    this._parametrosConsulta.update((parametros) => ({
      ...this._filtrosPermanentes(),
      ...filtros,
    }));
  }

  public actualizarPaginacion(page: number) {
    this._parametrosConsulta.update((parametros) => ({
      ...parametros,
      page,
    }));
  }

  public ejecutarContabilizarTodos() {
    const peticiones = this.registrosSeleccionados().map((id) =>
      this.contabilizarTodos(id),
    );

    return forkJoin(peticiones).pipe(
      finalize(() => {
        this.reiniciarRegistrosSeleccionados();
      }),
    );
  }

  public aplicarFiltros(filtros: ParametrosApi) {
    if (Object.keys(filtros).length >= 1) {
      this.reiniciarFiltros();
      this.actualizarFiltrosParametros(filtros);
    } else {
      this.reiniciarFiltros();
    }
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
