import { MapeoDocumento } from "@comun/type/mapeo-documentos.type";

export const documentoGuia: MapeoDocumento[] = [
  {
    nombre: 'ID',
    campoTipo: 'IntegerField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: true,
  },
  {
    nombre: 'GUIA',
    campoTipo: 'CharField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: true,
  },
  {
    nombre: 'GUIA__FECHA',
    campoTipo: 'DateField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: true,
    aplicaFormatoFechaIso: true
  },
  {
    nombre: 'GUIA__CLIENTE__NOMBRE_CORTO',
    campoTipo: 'CharField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: false,
  },
  {
    nombre: 'GUIA__CIUDAD_DESTINO__NOMBRE',
    campoTipo: 'CharField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: false,
  },
  {
    nombre: 'COBRO_ENTREGA',
    campoTipo: 'IntegerField',
    visibleTabla: true,
    visibleFiltro: false,
    ordenable: true,
    aplicaFormatoNumerico: true
  },
  {
    nombre: 'UNIDADES',
    campoTipo: 'IntegerField',
    visibleTabla: true,
    visibleFiltro: false,
    ordenable: true,
  },
  {
    nombre: 'PESO',
    campoTipo: 'IntegerField',
    visibleTabla: true,
    visibleFiltro: false,
    ordenable: true,
  },
  {
    nombre: 'VOLUMEN',
    campoTipo: 'IntegerField',
    visibleTabla: true,
    visibleFiltro: false,
    ordenable: true,
  },
  {
    nombre: 'GUIA__ESTADO_ENTREGADO',
    nombreAbreviado: 'GUIA__ESTADO_ENTREGADO_ABREVIATURA',
    campoTipo: 'Booleano',
    visibleTabla: true,
    visibleFiltro: false,
    ordenable: false,
  },
]
