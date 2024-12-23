import { Modelo } from "@comun/type/modelo.type";
import { Serializador } from "@comun/type/serializador.type";
import { FiltrosAplicados } from "./filtros-aplicados.interface";

export interface ParametrosFiltros {
  limite: number;
  desplazar: number;
  ordenamientos: string[];
  limite_conteo: number;
  modelo: Modelo;
  serializador?: Serializador;
  filtros: FiltrosAplicados[];
  documento_clase_id?: number;
}
