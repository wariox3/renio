import { FilterField } from 'src/app/core/interfaces/filtro.interface';

export const DOCUMENTO_REFERENCIA_LISTA_BUSCAR_AVANZADO: FilterField[] = [
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
  { name: 'total', displayName: 'Total', type: 'number' },
];

export const NOTA_CREDITO_DOCUMENTO_REFERENCIA_FILTRO_PERMANENTE: Record<
  string,
  any
> = {
  documento_tipo__documento_clase_id: 100,
  estado_aprobado: 'True',
};

export const NOTA_DEBITO_DOCUMENTO_REFERENCIA_FILTRO_PERMANENTE: Record<
  string,
  any
> = {
  documento_tipo__documento_clase_id: 100,
  estado_aprobado: 'True',
};
