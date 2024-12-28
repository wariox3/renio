import { CampoTipo } from "./mapeo-campo.type";
import { Modelo } from "./modelo.type";

export type MapeoBuscarAvanzado = {
  [key in Modelo]: {
    nombre: string;
    visibleTabla: boolean;
    visibleFiltro: boolean;
    ordenable: boolean;
    campoTipo: CampoTipo;
  }[];
};
