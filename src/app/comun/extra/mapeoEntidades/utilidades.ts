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

export const utilidades: Mapeo = {
  factura_electronica_emitir: [
    {
      nombre: 'ID',
      campoTipo: 'IntegerField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: true,
    },
    {
      nombre: 'DOCUMENTO__NUMERO',
      campoTipo: 'IntegerField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: true,
    },
    {
      nombre: 'ESTADO_ELECTRONICO_notificado',
      campoTipo: 'Booleano',
      visibleFiltro: true,
      visibleTabla: false,
      ordenable: true,
    },
  ],
  factura_electronica_notificar: [
    {
      nombre: 'ID',
      campoTipo: 'IntegerField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: true,
    },
    {
      nombre: 'DOCUMENTO__NUMERO',
      campoTipo: 'IntegerField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: true,
    },
  ],
};
