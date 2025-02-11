import { MapeoUtilidades } from '@comun/type/mapeo-utilidades.type';

export const utilidades: MapeoUtilidades = {
  factura_electronica_emitir: [
    {
      nombre: 'ID',
      campoTipo: 'IntegerField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: true,
    },
    {
      nombre: 'NUMERO',
      campoTipo: 'IntegerField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: true,
    },
    {
      nombre: 'ESTADO_ELECTRONICO_NOTIFICADO',
      campoTipo: 'Booleano',
      visibleFiltro: true,
      visibleTabla: false,
      ordenable: true,
    },
    {
      nombre: 'ESTADO_ELECTRONICO_ENVIADO',
      campoTipo: 'Booleano',
      visibleFiltro: true,
      visibleTabla: false,
      ordenable: true,
    },
  ],
  factura_electronica_notificar: [
    {
      nombre: 'ID',
      campoTipo: 'IntegerField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: true,
    },
    {
      nombre: 'NUMERO',
      campoTipo: 'IntegerField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: true,
    },
  ],
  eventos_dian: [
    {
      nombre: 'ID',
      campoTipo: 'IntegerField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: true,
    },
    {
      nombre: 'NUMERO',
      campoTipo: 'IntegerField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: true,
    },
  ],
  contabilizar: [
    {
      nombre: 'ID',
      campoTipo: 'IntegerField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: true,
    },
    {
      nombre: 'NUMERO',
      campoTipo: 'IntegerField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: true,
    },
  ],
};
