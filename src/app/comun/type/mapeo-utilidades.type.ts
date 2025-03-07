import { CampoTipo } from './mapeo-campo.type';
import { Modelo } from './modelo.type';

export type MapeoUtilidades = {
  [key: string]: {
    nombre: string;
    nombreAbreviado?: string;
    visibleFiltro: boolean;
    visibleTabla: boolean;
    ordenable: boolean;
    esFk?: boolean;
    modeloFk?: string;
    aplicaFormatoNumerico?: boolean;
    campoTipo: CampoTipo;
    nombreAbreviadoFiltro?: string;
    nombreFiltroRelacion?: string;
  }[];
};
