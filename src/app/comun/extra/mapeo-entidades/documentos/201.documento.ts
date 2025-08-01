import { MapeoDocumento } from '@comun/type/mapeo-documentos.type';

export const documento201: MapeoDocumento[] = [
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
    visibleFiltro: true,
    ordenable: false,
    esFk: true,
    modeloFk: 'GenContacto',
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
    campoTipo: 'Booleano',
    toolTip: 'ESTADO_ANULADO',
    visibleTabla: true,
    visibleFiltro: false,
    ordenable: false,
  },
  {
    nombre: 'ESTADO_CONTABILIZADO',
    nombreAbreviado: 'ESTADO_CONTABILIZADO_ABREVIATURA',
    campoTipo: 'Booleano',
    toolTip: 'ESTADO_CONTABILIZADO',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: false,
  },
];
