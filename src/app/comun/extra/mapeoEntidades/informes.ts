type Mapeo = {
    [key: string]: {
      nombre: string;
      nombreAbreviado?: string;
      visibleFiltro: boolean;
      visibleTabla: boolean;
      ordenable: boolean;
      esFk?: boolean;
      modeloFk?: string;
      aplicaFormatoNumerico?: boolean;
      campoTipo:
        | 'IntegerField'
        | 'FloatField'
        | 'CharField'
        | 'DateField'
        | 'Booleano';
    }[];
  };

  export const documentos: Mapeo = {
    'ventas_items': [
      {
        nombre: 'ID',
        campoTipo: 'IntegerField',
        visibleFiltro: true,
        visibleTabla: true,
        ordenable: true
      },
      {
        nombre: 'documento_tipo',
        campoTipo: 'CharField',
        visibleFiltro: false,
        visibleTabla: true,
        ordenable: false
      },
      {
        nombre: 'DOCUMENTO__FECHA',
        campoTipo: 'DateField',
        visibleFiltro: true,
        visibleTabla: true,
        ordenable: false
      },
      {
        nombre: 'DOCUMENTO__NUMERO',
        campoTipo: 'IntegerField',
        visibleFiltro: true,
        visibleTabla: true,
        ordenable: true
      },
      {
        nombre: 'ITEM_ID',
        campoTipo: 'CharField',
        visibleFiltro: false,
        visibleTabla: true,
        ordenable: false,
      },
      {
        nombre: 'ITEM_NOMBRE',
        campoTipo: 'CharField',
        visibleFiltro: true,
        visibleTabla: true,
        ordenable: false,
        esFk: true,
        modeloFk: 'Item'
      },
      {
        nombre: 'CANTIDAD',
        campoTipo: 'FloatField',
        visibleTabla: true,
        ordenable: false,
        visibleFiltro: false,
        aplicaFormatoNumerico: true
      },
      {
        nombre: 'PRECIO',
        campoTipo: 'FloatField',
        visibleFiltro: false,
        visibleTabla: true,
        ordenable: false,
        aplicaFormatoNumerico: true
      },
      {
        nombre: 'SUBTOTAL',
        campoTipo: 'FloatField',
        visibleFiltro: false,
        visibleTabla: true,
        ordenable: false,
        aplicaFormatoNumerico: true
      },
      {
        nombre: 'TOTAL',
        campoTipo: 'FloatField',
        visibleFiltro: false,
        visibleTabla: true,
        ordenable: false,
        aplicaFormatoNumerico: true
      },
    ]
}