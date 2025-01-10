import { CampoTipo } from "@comun/type/mapeo-campo.type";

export interface CampoLista {
  propiedad: string;
  titulo: string;
  toolTip?: string;
  aplicaFormatoNumerico?: boolean;
  alinearAlaIzquierda?: boolean;
  campoTipo: CampoTipo;
}
