import { MapeoDocumento } from '@comun/type/mapeo-documentos.type';

export const documentoHumAporte: MapeoDocumento[] = [
  {
    nombre: 'ID',
    campoTipo: 'IntegerField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: true,
  },
  {
    nombre: 'MES',
    campoTipo: 'CharField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: true,
  },
  {
    nombre: 'ANIO',
    campoTipo: 'CharField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: true,
  },
  {
    nombre: 'SUCURSAL_NOMBRE',
    campoTipo: 'CharField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: false,
  },
  {
    nombre: 'EMPLEADOS',
    campoTipo: 'IntegerField',
    visibleTabla: true,
    visibleFiltro: false,
    ordenable: false,
  },
  {
    nombre: 'CONTRATOS',
    nombreAbreviado: 'CONTRS',
    campoTipo: 'IntegerField',
    visibleTabla: true,
    visibleFiltro: false,
    ordenable: false,
  },
  {
    nombre: 'LINEAS',
    campoTipo: 'IntegerField',
    visibleTabla: true,
    visibleFiltro: false,
    ordenable: false,
  },
  {
    nombre: 'COTIZACION_TOTAL',
    campoTipo: 'IntegerField',
    visibleTabla: true,
    visibleFiltro: false,
    ordenable: false,
  },
  {
    nombre: 'ESTADO_APROBADO',
    campoTipo: 'Booleano',
    visibleTabla: true,
    visibleFiltro: false,
    ordenable: false,
  },
];
