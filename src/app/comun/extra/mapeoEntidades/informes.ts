type Mapeo = {
    [key: number]: {
      nombre: string;
      nombreAbreviado?: string;
      visibleFiltro: boolean;
      esFk?: boolean;
      modeloFk?: string;
      campoTipo:
        | 'IntegerField'
        | 'FloatField'
        | 'CharField'
        | 'DateField'
        | 'Booleano';
    }[];
  };

  export const documentos: Mapeo = {
    100: [
      {
        nombre: 'ID',
        campoTipo: 'IntegerField',
        visibleFiltro: false,
      },
      {
        nombre: 'NUMERO',
        campoTipo: 'IntegerField',
        visibleFiltro: false,
      },
      {
        nombre: 'FECHA',
        campoTipo: 'DateField',
        visibleFiltro: false,
      },
      {
        nombre: 'CONTACTO_NOMBRE_CORTO',
        campoTipo: 'CharField',
        visibleFiltro: false,
        esFk: true,
        modeloFk: 'Contacto'
      },
      {
        nombre: 'ITEM',
        campoTipo: 'CharField',
        visibleFiltro: true,
        esFk: true,
        modeloFk: 'Item'
      },
      {
        nombre: 'SUBTOTAL',
        campoTipo: 'FloatField',
        visibleFiltro: false,
      },
      {
        nombre: 'IMPUESTO',
        campoTipo: 'FloatField',
        visibleFiltro: false,
      },
      {
        nombre: 'TOTAL',
        campoTipo: 'FloatField',
        visibleFiltro: false,
      },
      {
        nombre: 'ESTADO_APROBADO',
        nombreAbreviado: 'ESTADO_APROBADO_ABREVIATURA',
        campoTipo: 'Booleano',
        visibleFiltro: false,
      },
      {
        nombre: 'ESTADO_ANULADO',
        nombreAbreviado: 'ESTADO_ANULADO_ABREVIATURA',
        campoTipo: 'Booleano',
        visibleFiltro: false,
      },
    ]
}