import { campoBuscarAvanzada } from 'src/app/core/interfaces/buscar-avanzado.interface';

export const DOCUMENTO_REFERENCIA_LISTA_BUSCAR_AVANZADO: campoBuscarAvanzada[] = [
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
  { name: 'total', displayName: 'Total', type: 'number', aplicaFormatoNumerico: true },
];

export const NOTA_AJUSTE_DOCUMENTO_REFERENCIA_FILTRO_PERMANENTE: Record<
  string,
  any
> = {
  documento_tipo__documento_clase_id: 303,
  estado_aprobado: 'True',
};

export const NOTA_CREDITO_DOCUMENTO_REFERENCIA_FILTRO_PERMANENTE: Record<
  string,
  any
> = {
  documento_tipo__documento_clase_id: 300,
  estado_aprobado: 'True',
};

export const NOTA_DEBITO_DOCUMENTO_REFERENCIA_FILTRO_PERMANENTE: Record<
  string,
  any
> = {
  documento_tipo__documento_clase_id: 301,
  estado_aprobado: 'True',
};


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
