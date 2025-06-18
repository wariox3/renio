import { MapeoDocumento } from '@comun/type/mapeo-documentos.type';

export const documentoHumLiquidacion: MapeoDocumento[] = [
  {
    nombre: 'ID',
    campoTipo: 'IntegerField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: true,
  },
  {
    nombre: 'CONTRATO',
    nombreAbreviado: 'CONTRATO',
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
];
