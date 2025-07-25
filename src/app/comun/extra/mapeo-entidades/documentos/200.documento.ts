import { MapeoDocumento } from '@comun/type/mapeo-documentos.type';

export const documento200: MapeoDocumento[] = [
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
    nombre: 'CONTACTO__NOMBRE_CORTO',
    nombreAbreviado: 'CONTACTO_NOMBRE_CORTO',
    nombreAbreviadoFiltro: 'CONTACTO_NOMBRE_FILTRO',
    nombreFiltroRelacion: 'CONTACTO__NOMBRE_CORTO',
    campoTipo: 'CharField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: false,
  },
  {
    nombre: 'SUBTOTAL',
    campoTipo: 'FloatField',
    visibleTabla: false,
    visibleFiltro: false,
    aplicaFormatoNumerico: true,
    ordenable: false,
  },
  {
    nombre: 'IMPUESTO',
    campoTipo: 'FloatField',
    visibleTabla: false,
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
    nombreAbreviado: 'ESTADO_APROBADO_ABREVIATURA',
    toolTip: 'ESTADO_APROBADO',
    campoTipo: 'Booleano',
    visibleTabla: true,
    visibleFiltro: false,
    ordenable: false,
  },
  {
    nombre: 'ESTADO_ANULADO',
    nombreAbreviado: 'ESTADO_ANULADO_ABREVIATURA',
    toolTip: 'ESTADO_ANULADO',
    campoTipo: 'Booleano',
    visibleTabla: true,
    visibleFiltro: false,
    ordenable: false,
  },
  {
    nombre: 'ESTADO_CONTABILIZADO',
    nombreAbreviado: 'ESTADO_CONTABILIZADO_ABREVIATURA',
    toolTip: 'ESTADO_CONTABILIZADO',
    campoTipo: 'Booleano',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: false,
  },
];
