import { MapeoDocumento } from '@comun/type/mapeo-documentos.type';

export const documento701: MapeoDocumento[] = [
  {
    nombre: 'ID',
    campoTipo: 'IntegerField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: true,
  },
  {
    nombre: 'DOCUMENTO_TIPO__NOMBRE',
    nombreAbreviadoFiltro: 'DOCUMENTO_TIPO_NOMBRE',
    nombreAbreviado: 'TIPO',
    campoTipo: 'CharField',
    visibleTabla: true,
    visibleFiltro: false,
    ordenable: false,
  },
  {
    nombre: 'NUMERO',
    campoTipo: 'IntegerField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: true,
  },
  {
    nombre: 'FECHA_DESDE',
    nombreAbreviado: 'DESDE',
    campoTipo: 'DateField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: true,
  },
  {
    nombre: 'FECHA_HASTA',
    nombreAbreviado: 'HASTA',
    campoTipo: 'DateField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: true,
  },
  {
    nombre: 'CONTACTO_ID',
    campoTipo: 'Fk',
    visibleTabla: true,
    visibleFiltro: false,
    ordenable: false,
    esFk: true,
  },
  {
    nombre: 'CONTACTO__NUMERO_IDENTIFICACION',
    nombreAbreviado: 'CONTACTO_NUMERO_IDENTIFICACION',
    nombreAbreviadoFiltro: 'CONTACTO_IDENTIFICACION_FILTRO',
    nombreFiltroRelacion: 'CONTACTO__NUMERO_IDENTIFICACION',
    campoTipo: 'CharField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: false,
  },
  {
    nombre: 'CONTACTO__NOMBRE_CORTO',
    nombreAbreviadoFiltro: 'CONTACTO_NOMBRE_FILTRO',
    nombreFiltroRelacion: 'contacto__nombre_corto',
    nombreAbreviado: 'EMPLEADO',
    campoTipo: 'CharField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: false,
  },
  {
    nombre: 'SALARIO',
    campoTipo: 'FloatField',
    visibleTabla: true,
    visibleFiltro: false,
    aplicaFormatoNumerico: true,
    ordenable: false,
  },
  {
    nombre: 'DEVENGADO',
    campoTipo: 'FloatField',
    visibleTabla: true,
    visibleFiltro: false,
    aplicaFormatoNumerico: true,
    ordenable: false,
  },
  {
    nombre: 'DEDUCCION',
    campoTipo: 'FloatField',
    visibleTabla: true,
    visibleFiltro: false,
    aplicaFormatoNumerico: true,
    ordenable: false,
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
