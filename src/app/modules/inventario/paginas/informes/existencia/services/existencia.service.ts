import { inject, Injectable, signal } from '@angular/core';
import { GeneralService } from '@comun/services/general.service';
import { HttpService } from '@comun/services/http.service';
import { Filtros } from '@interfaces/comunes/componentes/filtros/filtros.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { RespuestaContabilizarLista } from '@modulos/contabilidad/interfaces/contabilizar.interface';
import { finalize, forkJoin, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExistenciaService {
  private readonly _generalService = inject(GeneralService);
  private readonly _httpService = inject(HttpService);
  private readonly _parametrosConsulta = signal<ParametrosFiltros>({
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 0,
    modelo: 'GenItem',
    filtros: [
      {
        propiedad: 'inventario',
        operador: 'exact',
        valor1: true,
      },
    ],
  });
  private readonly _filtrosPermanentes = signal<Filtros[]>([
    {
      propiedad: 'inventario',
      operador: 'exact',
      valor1: true,
    },
  ]);

  public cantidadRegistros = signal(0);
  public registrosSeleccionados = signal<number[]>([]);
  public totalGeneral = signal(0);
  public contabilizarLista = signal<RespuestaContabilizarLista[]>([]);

  public consultarListaContabilizar() {
    return this._generalService
      .consultarDatosAutoCompletar<RespuestaContabilizarLista>(
        this._parametrosConsulta(),
      )
      .pipe(
        tap((respuesta) => {
          this.cantidadRegistros.set(respuesta.cantidad_registros);
          this.contabilizarLista.set(respuesta.registros);
        }),
      );
  }

  public reiniciarFiltros() {
    this._parametrosConsulta.update((parametros) => {
      return {
        ...parametros,
        filtros: this._filtrosPermanentes(),
      };
    });
  }

  public contabilizarTodos(id: number) {
    return this._httpService.post('general/documento/contabilizar/', {
      id,
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

  actualizarOrdenamiento(ordenamiento: string) {
    this._parametrosConsulta.update((parametros) => ({
      ...parametros,
      ordenamientos: [ordenamiento],
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
