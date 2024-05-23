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
  ventas_items: [
    {
      nombre: 'ID',
      campoTipo: 'IntegerField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: true,
    },
    {
      nombre: 'documento_tipo',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
    },
    {
      nombre: 'DOCUMENTO__NUMERO',
      campoTipo: 'IntegerField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: true,
    },
    {
      nombre: 'DOCUMENTO__FECHA',
      campoTipo: 'DateField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: false,
    },
    {
      nombre: 'Contacto',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
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
      modeloFk: 'Item',
    },
    {
      nombre: 'CANTIDAD',
      campoTipo: 'FloatField',
      visibleTabla: true,
      ordenable: false,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'PRECIO',
      campoTipo: 'FloatField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'SUBTOTAL',
      campoTipo: 'FloatField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'IMPUESTO',
      campoTipo: 'FloatField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'TOTAL',
      campoTipo: 'FloatField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
  ],
  cuentas_cobrar: [
    {
      nombre: 'ID',
      campoTipo: 'IntegerField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: true,
    },
    {
      nombre: 'NUMERO',
      campoTipo: 'CharField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: false,
    },
    {
      nombre: 'FECHA',
      campoTipo: 'DateField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: true,
    },
    {
      nombre: 'FECHA_VENCE',
      campoTipo: 'DateField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
    },
    {
      nombre: 'FECHA_CONTABLE',
      campoTipo: 'DateField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'CONTACTO',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
    },
    {
      nombre: 'SUBTOTAL',
      campoTipo: 'FloatField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'BASE_IMPUESTO',
      campoTipo: 'FloatField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'IMPUESTO',
      campoTipo: 'FloatField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'DESCUENTO',
      campoTipo: 'FloatField',
      visibleTabla: false,
      ordenable: false,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'TOTAL',
      campoTipo: 'FloatField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'PENDIENTE',
      campoTipo: 'FloatField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'ESTADO_ANULADO',
      nombreAbreviado: 'ESTADO_ANULADO_ABREVIATURA',
      campoTipo: 'Booleano',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: true,
    },
    {
      nombre: 'ESTADO_APROBADO',
      nombreAbreviado: 'ESTADO_APROBADO_ABREVIATURA',
      campoTipo: 'Booleano',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: true,
    },
    {
      nombre: 'ESTADO_ELECTRONICO',
      campoTipo: 'Booleano',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'ESTADO_ELECTRONICO_ENVIADO',
      campoTipo: 'Booleano',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'ESTADO_ELECTRONICO_NOTIFICADO',
      campoTipo: 'Booleano',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'DOCUMENTO_TIPO',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'METODO_PAGO',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'CONTACTO_ID',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'CONTACTO_NOMBRE_CORTO',
      campoTipo: 'CharField',
      visibleFiltro: true,
      visibleTabla: false,
      ordenable: false,
      esFk: true,
      modeloFk: 'Contacto'
    },
    {
      nombre: 'ITEM_NOMBRE',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
      esFk: true,
      modeloFk: 'Item',
    },
    {
      nombre: 'SOPORTE',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },

    {
      nombre: 'ORDEN_COMPRA',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'CUE',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'EMPRESA',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'RESOLUCION',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'DOCUMENTO_REFERENCIA',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'PLAZO_PAGO',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'COMENTARIO',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
  ],
};
