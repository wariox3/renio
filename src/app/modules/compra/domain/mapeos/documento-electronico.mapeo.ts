import { FilterField } from 'src/app/core/interfaces/filtro.interface';

export const DOCUMENTO_ELECTRONICO_FILTERS: FilterField[] = [
  { name: 'id', displayName: 'ID', type: 'number' },
  { name: 'numero', displayName: 'Número', type: 'string' },
  {
    name: 'ESTADO_ELECTRONICO_NOTIFICADO',
    displayName: 'Estado electronico notificado',
    type: 'boolean',
  },
  {
    name: 'ESTADO_ELECTRONICO_ENVIADO',
    displayName: 'Estado electronico enviado',
    type: 'boolean',
  },
];
