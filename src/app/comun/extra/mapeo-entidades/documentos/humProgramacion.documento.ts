import { MapeoDocumento } from '@comun/type/mapeo-documentos.type';

export const documentoHumProgramacion: MapeoDocumento[] = [
  {
    nombre: 'ID',
    campoTipo: 'IntegerField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: true,
  },
  {
    nombre: 'NOMBRE',
    campoTipo: 'CharField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: true,
  },
  {
    nombre: 'PAGO_TIPO_NOMBRE',
    nombreAbreviadoFiltro: 'PAGO_TIPO_NOMBRE_FILTRO',
    nombreFiltroRelacion: 'pago_tipo__nombre',
    campoTipo: 'CharField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: true,
  },
  {
    nombre: 'GRUPO_NOMBRE',
    nombreAbreviadoFiltro: 'GRUPO_NOMBRE_FILTRO',
    nombreFiltroRelacion: 'grupo__nombre',
    campoTipo: 'CharField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: true,
  },
  {
    nombre: 'PERIODO_NOMBRE',
    nombreAbreviadoFiltro: 'PERIODO_NOMBRE_FILTRO',
    nombreFiltroRelacion: 'periodo__nombre',
    campoTipo: 'CharField',
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
    nombre: 'DIAS',
    campoTipo: 'FloatField',
    visibleTabla: true,
    visibleFiltro: false,
    aplicaFormatoNumerico: false,
    ordenable: false,
  },
  {
    nombre: 'CONTRATOS',
    campoTipo: 'FloatField',
    visibleTabla: true,
    visibleFiltro: false,
    aplicaFormatoNumerico: false,
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
    nombre: 'ESTADO_GENERADO',
    toolTip: 'ESTADO_GENERADO',
    nombreAbreviado: 'ESTADO_GENERADO_ABREVIATURA',
    campoTipo: 'Booleano',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: false,
  },
];
