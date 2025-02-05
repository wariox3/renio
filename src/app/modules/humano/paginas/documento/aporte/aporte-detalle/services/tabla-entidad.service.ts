import { inject, Injectable, signal } from '@angular/core';
import { GeneralService } from '@comun/services/general.service';
import { Filtros } from '@interfaces/comunes/componentes/filtros/filtros.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { RespuestaAporteEntidad } from '@modulos/humano/interfaces/respuesta-aporte-entidad.interface';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TablaEntidadService {
  private readonly _generalService = inject(GeneralService);
  private readonly _parametrosConsulta = signal<ParametrosFiltros>({
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 0,
    modelo: 'HumAporteDetalle',
    filtros: [],
  });

  public aporteEntidadLista = signal<RespuestaAporteEntidad[]>([]);
  public aporteEntidadListaAgrupada = signal<
    {
      cotizacionTotal: number;
      entidades: RespuestaAporteEntidad[];
    }[]
  >([]);
  public cantidadRegistros = signal(0);

  public consultarListaEntidades() {
    return this._generalService
      .consultarDatosAutoCompletar<RespuestaAporteEntidad>(
        this._parametrosConsulta()
      )
      .pipe(
        tap((respuesta) => {
          this.cantidadRegistros.set(respuesta.cantidad_registros);
          this.aporteEntidadLista.set(respuesta.registros);
          const registrosAgrupados = this._groupByTipo(respuesta.registros);
          this.aporteEntidadListaAgrupada.set(registrosAgrupados);
        })
      );
  }

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
        entidad_nombre: item.entidad_nombre,
        cotizacion: item.cotizacion,
      });

      return acc;
    }, {});

    return Object.values(grouped);
  }

  public inicializarParametros(detalleId: number) {
    this._parametrosConsulta.set({
      limite: 50,
      desplazar: 0,
      ordenamientos: ['tipo'],
      limite_conteo: 0,
      modelo: 'HumAporteEntidad',
      filtros: [
        {
          propiedad: 'aporte_id',
          operador: 'exact',
          valor1: detalleId,
        },
      ],
    });
  }

  public actualizarFiltrosParametros(filtros: Filtros[]) {
    this._parametrosConsulta.update((parametros) => ({
      ...parametros,
      filtros: [...parametros.filtros, ...filtros],
    }));
  }

  get getParametrosConsular() {
    return this._parametrosConsulta();
  }
}
