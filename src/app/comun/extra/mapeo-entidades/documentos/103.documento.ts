import { MapeoDocumento } from '@comun/type/mapeo-documentos.type';

export const documento103: MapeoDocumento[] = [
  {
    nombre: 'ID',
    campoTipo: 'IntegerField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: true,
  },
  {
    nombre: 'CONTACTO__NUMERO_IDENTIFICACION',
    nombreAbreviado: 'CONTACTO_NUMERO_IDENTIFICACION',
    nombreAbreviadoFiltro: 'CONTACTO_IDENTIFICACION_FILTRO',
    nombreFiltroRelacion: 'contacto__numero_identificacion',
    campoTipo: 'CharField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: false,
  },
  {
    nombre: 'CONTACTO__NOMBRE_CORTO',
    nombreAbreviado: 'CONTACTO_NOMBRE_CORTO',
    campoTipo: 'Fk',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: false,
    esFk: true,
    modeloFk: 'GenContacto',
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
    toolTip: 'ESTADO_APROBADO',
    nombreAbreviado: 'ESTADO_APROBADO_ABREVIATURA',
    campoTipo: 'Booleano',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: false,
  },
  {
    nombre: 'ESTADO_ANULADO',
    toolTip: 'ESTADO_ANULADO',
    nombreAbreviado: 'ESTADO_ANULADO_ABREVIATURA',
    campoTipo: 'Booleano',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: false,
  },
  {
    nombre: 'ESTADO_ELECTRONICO',
    toolTip: 'ESTADO_ELECTRONICO',
    nombreAbreviado: 'ESTADO_ELECTRONICO_ABREVIATURA',
    campoTipo: 'Booleano',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: false,
  },
  {
    nombre: 'ESTADO_CONTABILIZADO',
    toolTip: 'ESTADO_CONTABILIZADO',
    nombreAbreviado: 'ESTADO_CONTABILIZADO_ABREVIATURA',
    campoTipo: 'Booleano',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: false,
  },
];
