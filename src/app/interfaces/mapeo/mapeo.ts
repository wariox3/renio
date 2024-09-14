export type MapeoIndependientes = {
  [key: number | string]: {
    nombre: string;
    nombreAbreviado?: string;
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

export type MapeoDocumentos = {
  [key: number | string]: {
    nombre: string;
    nombreAbreviado?: string;
    visibleTabla: boolean;
    visibleFiltro: boolean;
    ordenable: boolean;
    esFk?: boolean;
    modeloFk?: string;
    toolTip?: string;
    aplicaFormatoNumerico?: boolean;
    alinearAlaIzquierda?: boolean;
    campoTipo: CampoTipo;
  }[];
};

export type MapeoAdministrador = {
  [key: string]: {
    modulo: ModuloAplicacion;
    modelo: string;
    tipo: 'Administrador' | 'Movimiento';
    datos: {
      nombre: string;
      nombreAbreviado?: string;
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

export type CampoTipo =
  | 'IntegerField'
  | 'FloatField'
  | 'CharField'
  | 'DateField'
  | 'Booleano'
  | 'Porcentaje'
  | 'Fk';

export type ModuloAplicacion =
  | 'compra'
  | 'venta'
  | 'contabilidad'
  | 'cartera'
  | 'humano'
  | 'inventario'
  | 'general'
  | 'transporte';
