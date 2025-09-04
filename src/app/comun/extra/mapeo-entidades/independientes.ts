import { MapeoIndependientes } from "@comun/type/mapeo-independientes.type";

export const mapeoIndependientes: MapeoIndependientes = {
  TransGuia: [
    {
      nombre: 'ID',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'CIUDAD_ORIGEN__NOMBRE',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
    },
    {
      nombre: 'CIUDAD_DESTINO__NOMBRE',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
    },
    {
      nombre: 'DESTINATARIO_NOMBRE',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
    },
    {
      nombre: 'PESO',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
    },
    {
      nombre: 'VOLUMEN',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
    },
    {
      nombre: 'FLETE',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      aplicaFormatoNumerico: true

    },
    {
      nombre: 'MANEJO',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      aplicaFormatoNumerico: true
    },
  ],
};
