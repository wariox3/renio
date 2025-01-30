import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { AutocompletarRegistros } from '@interfaces/comunes/autocompletar/autocompletar';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  private readonly _httpService = inject(HttpService);

  /**
   * Realiza una consulta POST a la API para obtener registros filtrados.
   *
   * @template T - Tipo genérico que define la estructura de los datos esperados en la respuesta.
   * @param {Readonly<Partial<ParametrosFiltros>>} filtros -
   *        Objeto con parámetros de filtrado que permiten personalizar la consulta.
   *        Puede incluir campos como `modelo`, `serializador`, y otros criterios.
   * @returns {Observable<AutocompletarRegistros<T>>} -
   *          Un observable que emite los resultados obtenidos desde la API.
   *          La estructura esperada está definida por `AutocompletarRegistros<T>`.
   *
   * @description
   * Este método se utiliza para obtener una lista de registros filtrados que cumplen
   * con los parámetros especificados. Es útil, por ejemplo, para obtener sugerencias
   * en campos de autocompletado o listas de selección filtradas dinámicamente.
   *
   * @example
   * // Ejemplo de uso con un tipo específico de datos
   * this._generalServices.consultarDatosAutoCompletar<RegistroAutocompletarIdentificacion>({
   *   modelo: 'GenIdentificacion',
   *   serializador: 'ListaAutocompletar'
   * }).subscribe((resultado) => {
   *   console.log(resultado);
   * });
   *
   * @example
   * // Ejemplo con filtros parciales
   * this._generalServices.consultarDatosAutoCompletar({
   *   modelo: 'OtroModelo'
   * }).subscribe((resultado) => {
   *   console.log('Datos filtrados:', resultado);
   * });
   */
  consultarDatosAutoCompletar<T>(
    filtros: Readonly<Partial<ParametrosFiltros>>
  ): Observable<AutocompletarRegistros<T>> {
    return this._httpService.post<AutocompletarRegistros<T>>(
      'general/funcionalidad/lista/',
      filtros
    );
  }

  consultarDatosLista<T>(
    filtros: Readonly<Partial<ParametrosFiltros>>
  ): Observable<T> {
    return this._httpService.post<T>('general/funcionalidad/lista/', filtros);
  }

  consultarConfiguracion<T>(parametros: { campos?: string[] }): Observable<T> {
    return this._httpService.post<T>(
      'general/configuracion/consulta/',
      parametros
    );
  }
}
