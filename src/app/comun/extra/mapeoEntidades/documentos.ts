type Mapeo = {
  [key: number]: {
    nombre: string;
    visibleTabla: boolean;
    visibleFiltro: boolean;
    ordenable: boolean;
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
  1: [
    {
      nombre: 'ID',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'NUMERO',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'FECHA',
      campoTipo: 'DateField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'CONTACTO_NOMBRE_CORTO',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'SUBTOTAL',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'IMPUESTO',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'TOTAL',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'ESTADO_APROBADO',
      campoTipo: 'Booleano',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
    {
      nombre: 'ESTADO_ANULADO',
      campoTipo: 'Booleano',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
  ],
  2: [
    {
      nombre: 'ID',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'NUMERO',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'FECHA',
      campoTipo: 'DateField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'CONTACTO_NOMBRE_CORTO',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'SUBTOTAL',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'IMPUESTO',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'TOTAL',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'ESTADO_APROBADO',
      campoTipo: 'Booleano',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
    {
      nombre: 'ESTADO_ANULADO',
      campoTipo: 'Booleano',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
  ],
  3: [
    {
      nombre: 'ID',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'NUMERO',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'FECHA',
      campoTipo: 'DateField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'CONTACTO_NOMBRE_CORTO',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'SUBTOTAL',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'IMPUESTO',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'TOTAL',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'ESTADO_APROBADO',
      campoTipo: 'Booleano',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
    {
      nombre: 'ESTADO_ANULADO',
      campoTipo: 'Booleano',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
  ],
};