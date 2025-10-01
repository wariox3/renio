import { FilterField } from 'src/app/core/interfaces/filtro.interface';

export const EXISTENCIA_FILTERS: FilterField[] = [
  { name: 'id', displayName: 'ID', type: 'number' },
  { name: 'codigo', displayName: 'Código', type: 'string' },
  { name: 'referencia', displayName: 'Referencia', type: 'string' },
];
