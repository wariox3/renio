import { campoBuscarAvanzada } from 'src/app/core/interfaces/buscar-avanzado.interface';

export const DOCUMENTO_REFERENCIA_LISTA_BUSCAR_AVANZADO: campoBuscarAvanzada[] =
  [
    { name: 'id', displayName: 'ID', type: 'number' },
    {
      name: 'documento_tipo_nombre',
      displayName: '[documento tipo] nombre',
      type: 'string',
    },
    { name: 'numero', displayName: 'numero', type: 'number' },
    { name: 'fecha', displayName: 'fecha', type: 'date' },
    {
      name: 'contacto_numero_identificacion',
      displayName: '[contacto] numero identificación',
      type: 'number',
    },
    {
      name: 'contacto_nombre_corto',
      displayName: '[contacto]  nombre',
      type: 'string',
    },
    {
      name: 'total',
      displayName: 'Total',
      type: 'number',
      aplicaFormatoNumerico: true,
    },
  ];

export const DOCUMENTO_REFERENCIA_FILTROS_BUSCAR_AVANZADO: campoBuscarAvanzada[] =
  [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'numero', displayName: 'numero', type: 'number' },
    { name: 'fecha', displayName: 'fecha', type: 'date' },
    {
      name: 'documento_tipo_nombre',
      displayName: '[documento tipo] nombre',
      type: 'string',
    },
    {
      name: 'contacto_numero_identificacion',
      displayName: '[contacto] numero identificación',
      type: 'number',
    },
    {
      name: 'contacto_nombre_corto',
      displayName: '[contacto]  nombre',
      type: 'string',
    },
  ];

export const NOTA_CREDITO_DOCUMENTO_REFERENCIA_FILTRO_PERMANENTE: Record<
  string,
  any
> = {
  estado_aprobado: 'True',
  documento_tipo__venta: 'True',
  documento_tipo__operacion: 1,
};

export const NOTA_DEBITO_DOCUMENTO_REFERENCIA_FILTRO_PERMANENTE: Record<
  string,
  any
> = {
  documento_tipo__documento_clase_id: 100,
  estado_aprobado: 'True',
};
