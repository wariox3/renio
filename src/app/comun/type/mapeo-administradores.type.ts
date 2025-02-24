import { AplicacionModulo } from "./aplicacion-modulo.type";
import { CampoTipo } from "./mapeo-campo.type";

export type MapeoAdministrador = {
  [key: string]: {
    modulo: AplicacionModulo;
    modelo: string;
    tipo: 'Administrador' | 'Movimiento';
    datos: {
      nombre: string;
      nombreAbreviado?: string;
      nombreAbreviadoFiltro?: string;
      nombreFiltroRelacion?: string;
      toolTip?: string;
      visibleTabla: boolean;
      visibleFiltro: boolean;
      ordenable: boolean;
      esFk?: boolean;
      modeloFk?: string;
      aplicaFormatoNumerico?: boolean;
      alinearAlaIzquierda?: boolean;
      campoTipo: CampoTipo;
    }[];
  };
};
