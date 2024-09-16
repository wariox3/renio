export interface Menu {
  name?: string;
  url?: string;
  icon?: string;
  children?: Menu[];
}
export interface informacionMenuItem {
  nombre: string;
  tipo?: string;
  url?: string;
  urlIndependientes?: {
    lista?: string;
    nuevo?: string;
    detalle?: string;
  };
  menuOpen?: boolean;
  visualiazarIconoDeracha?: boolean;
  consultaHttp?: boolean;
  configuracionExtra?: boolean;
  esIndependiente?: boolean;
  data?: {
    [key: string]: any;
  };
  children?: informacionMenuItem[];
}


export interface MenuItem {
  seleccion: string;
  informacion: informacionMenuItem[];
  dataMapeo: any[];
  modulos: string[];
}
