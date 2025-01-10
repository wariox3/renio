import { MapaDatos } from "@comun/type/mapeo-data.type";

export const FiltrosDetalleProgramacionContratos: MapaDatos[] = [
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
    nombreFiltroRelacion: 'contrato__contacto__numero_identificacion',
    campoTipo: 'CharField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: false,
  },
]
