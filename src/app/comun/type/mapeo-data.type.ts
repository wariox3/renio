import { CampoTipo } from "./mapeo-campo.type";

export type MapaDatos  = {
  nombre: string;
  nombreAbreviado?: string;
  nombreAbreviadoFiltro?: string;
  nombreFiltroRelacion?: string;
  visibleTabla: boolean;
  visibleFiltro: boolean;
  ordenable: boolean;
  esFk?: boolean;
  modeloFk?: string;
  aplicaFormatoNumerico?: boolean;
  alinearAlaIzquierda?: boolean;
  campoTipo: CampoTipo;
}
