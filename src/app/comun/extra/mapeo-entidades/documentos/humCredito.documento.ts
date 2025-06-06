import { MapeoDocumento } from '@comun/type/mapeo-documentos.type';

export const documentoHumCredito: MapeoDocumento[] = [
  {
    nombre: 'ID',
    campoTipo: 'IntegerField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: true,
  },
  {
    nombre: 'CONTRATO_CONTACTO_ID',
    campoTipo: 'CharField',
    visibleTabla: false,
    visibleFiltro: false,
    ordenable: false,
  },
  {
    nombre: 'CONTRATO_CONTACTO_NUMERO_IDENTIFICACION',
    nombreAbreviadoFiltro: 'CONTACTO_IDENTIFICACION_FILTRO',
    nombreFiltroRelacion: 'contrato__contacto__numero_identificacion',
    campoTipo: 'CharField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: true,
  },
  {
    nombre: 'CONTRATO_CONTACTO_NOMBRE_CORTO',
    nombreAbreviadoFiltro: 'CONTACTO_NOMBRE_FILTRO',
    nombreFiltroRelacion: 'contrato__contacto__nombre_corto',
    campoTipo: 'CharField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: true,
  },
  {
    nombre: 'FECHA_INICIO',
    campoTipo: 'DateField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: true,
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
    nombre: 'CUOTA',
    nombreAbreviado: 'VALOR_CUOTA',
    campoTipo: 'FloatField',
    visibleTabla: true,
    visibleFiltro: true,
    aplicaFormatoNumerico: true,
    ordenable: true,
  },
  {
    nombre: 'CUOTA_ACTUAL',
    campoTipo: 'CharField',
    visibleTabla: true,
    visibleFiltro: true,
    aplicaFormatoNumerico: true,
    ordenable: true,
  },
  {
    nombre: 'CANTIDAD_CUOTAS',
    alinearAlaIzquierda: true,
    campoTipo: 'IntegerField',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: true,
  },
  {
    nombre: 'ABONO',
    campoTipo: 'FloatField',
    visibleTabla: true,
    visibleFiltro: false,
    aplicaFormatoNumerico: true,
    ordenable: false,
  },
  {
    nombre: 'SALDO',
    campoTipo: 'FloatField',
    visibleTabla: true,
    visibleFiltro: false,
    aplicaFormatoNumerico: true,
    ordenable: false,
  },
  {
    nombre: 'VALIDAR_CUOTAS',
    nombreAbreviado: 'VALIDAR_CUOTAS_ABREVIATURA',
    campoTipo: 'Booleano',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: false,
  },
  {
    nombre: 'PAGADO',
    campoTipo: 'Booleano',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: false,
  },
  {
    nombre: 'INACTIVO',
    campoTipo: 'Booleano',
    visibleTabla: true,
    visibleFiltro: true,
    ordenable: false,
  },
];
