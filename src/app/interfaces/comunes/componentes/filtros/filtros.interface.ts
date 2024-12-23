import { ValorFiltro } from "@comun/type/valor-filtro.type";

export interface Filtros {
  propiedad: string;
  operador?: string;
  valor1: ValorFiltro;
  valor2?: ValorFiltro;
}
