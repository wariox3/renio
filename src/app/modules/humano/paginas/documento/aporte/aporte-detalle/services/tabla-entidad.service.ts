import { inject, Injectable, signal } from '@angular/core';
import { GeneralService } from '@comun/services/general.service';
import { RespuestaAporteEntidad } from '@modulos/humano/interfaces/respuesta-aporte-entidad.interface';
import { tap } from 'rxjs';
import { ParametrosApi, RespuestaApi } from 'src/app/core/interfaces/api.interface';

@Injectable({
  providedIn: 'root',
})
export class TablaEntidadService {
  private readonly _generalService = inject(GeneralService);
  private readonly _parametrosConsulta = signal<ParametrosApi>({
    limit: 50,
  });

  public cantidadRegistros = signal(0);
  public totalGeneral = signal(0);
  public aporteEntidadLista = signal<RespuestaAporteEntidad[]>([]);
  public aporteEntidadListaAgrupada = signal<
    {
      cotizacionTotal: number;
      entidades: RespuestaAporteEntidad[];
    }[]
  >([]);

  private _groupByTipo(data: any[]): {
    cotizacionTotal: number;
    entidades: RespuestaAporteEntidad[];
  }[] {
    const grouped = data.reduce((acc, item) => {
      if (!acc[item.tipo]) {
        acc[item.tipo] = { cotizacionTotal: 0, entidades: [] };
      }

      acc[item.tipo].cotizacionTotal += item.cotizacion;
      acc[item.tipo].entidades.push({
        id: item.id,
        tipo: item.tipo,
        entidad_id: item.entidad_id,
        entidad__nombre: item.entidad__nombre,
        cotizacion: item.cotizacion,
      });

      return acc;
    }, {});

    return Object.values(grouped);
  }

  public consultarListaEntidades() {
    return this._generalService
      .consultaApi<RespuestaApi<RespuestaAporteEntidad>>(
        'humano/aporte_entidad',
        this._parametrosConsulta()
      )
      .pipe(
        tap((respuesta) => {
          this.cantidadRegistros.set(respuesta.count);
          this.aporteEntidadLista.set(respuesta.results);
          const registrosAgrupados = this._groupByTipo(respuesta.results);
          this.aporteEntidadListaAgrupada.set(registrosAgrupados);
          this.totalGeneral.set(this.getTotalGeneral());
        })
      );
  }

  private getTotalGeneral() {
    return this.aporteEntidadListaAgrupada().reduce(
      (sum, item) => sum + item.cotizacionTotal,
      0
    );
  }

  public inicializarParametros(detalleId: number) {
    this._parametrosConsulta.set({
      limit: 50,
      ordering: 'tipo',
      aporte_id: detalleId,
    });
  }

  public actualizarFiltrosParametros(filtros: ParametrosApi) {
    this._parametrosConsulta.update((parametros) => ({
      ...parametros,
      ...filtros,
    }));
  }

  public actualizarPaginacion(page: number) {
    this._parametrosConsulta.update((parametros) => ({
      ...parametros,
      page: page,
    }));
  }

  get getParametrosConsular() {
    return this._parametrosConsulta();
  }
}
