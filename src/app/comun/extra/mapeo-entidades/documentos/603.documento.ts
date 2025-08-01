import { MapeoDocumento } from '@comun/type/mapeo-documentos.type';

export const documento603: MapeoDocumento[] = [
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
    campoTipo: 'Fk',
    visibleTabla: true,
    visibleFiltro: false,
    ordenable: false,
    esFk: true,
  },
  {
    nombre: 'SOPORTE',
    campoTipo: 'CharField',
    visibleTabla: true,
    visibleFiltro: false,
    ordenable: false,
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
    nombre: 'ESTADO_CONTABILIZADO',
    toolTip: 'ESTADO_CONTABILIZADO',
    nombreAbreviado: 'ESTADO_CONTABILIZADO_ABREVIATURA',
    campoTipo: 'Booleano',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: false,
  },
];
