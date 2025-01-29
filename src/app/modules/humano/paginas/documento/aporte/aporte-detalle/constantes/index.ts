import { MapaDatos } from '@comun/type/mapeo-data.type';

export const FiltrosDetalleAporteDetalle: MapaDatos[] = [
  {
    nombre: 'ID',
    campoTipo: 'IntegerField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: true,
  },
];

export const FiltrosDetalleAporteContratos: MapaDatos[] = [
  {
    nombre: 'ID',
    campoTipo: 'IntegerField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: true,
  },
  {
    nombre: 'CONTACTO_NUMERO_IDENTIFICACION',
    nombreAbreviadoFiltro: 'CONTACTO_IDENTIFICACION_FILTRO',
    nombreFiltroRelacion: 'CONTRATO__CONTACTO__NUMERO_IDENTIFICACION',
    campoTipo: 'CharField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: false,
  },
];
