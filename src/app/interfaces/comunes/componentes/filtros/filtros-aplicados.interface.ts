import { Filtros } from "./filtros.interface";

export interface FiltrosAplicados extends Filtros {
  visualizarBtnAgregarFiltro?: boolean;
  operadorFiltro?: string;
}
