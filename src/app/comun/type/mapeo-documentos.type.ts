import { CampoTipo } from "./mapeo-campo.type";

export type MapeoDocumento = {
    nombre: string;
    nombreAbreviado?: string;
    nombreAbreviadoFiltro?: string;
    nombreFiltroRelacion?: string;
    visibleTabla: boolean;
    visibleFiltro: boolean;
    ordenable: boolean;
    esFk?: boolean;
    modeloFk?: string;
    toolTip?: string;
    aplicaFormatoNumerico?: boolean;
    alinearAlaIzquierda?: boolean;
    campoTipo: CampoTipo;
    stylePersonalizado?: { [key: string]: string } | null; // Para estilos css en línea tr
    classPersonalizado?: string;  // Para clases css en línea tr
};


export type MapeoDocumentos = {
  [key: number | string]: MapeoDocumento[];
};
