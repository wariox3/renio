import { Operator } from '../../interfaces/filtro.interface';

export const OPERADORES_FILTRO: Operator[] = [
  {
    symbol: '=',
    name: 'Igual',
    types: ['string', 'number', 'date', 'boolean'],
    default: true,
  },
  {
    symbol: '>',
    name: 'Mayor a',
    types: ['number', 'date'],
    default: false,
  },
  {
    symbol: '>=',
    name: 'Mayor o igual a',
    types: ['number', 'date'],
    default: false,
  },
  {
    symbol: '<',
    name: 'Menor a',
    types: ['number', 'date'],
    default: false,
  },
  {
    symbol: '<=',
    name: 'Menor o igual a',
    types: ['number', 'date'],
    default: false,
  },
  { symbol: 'contains', name: 'Contiene', types: ['string'], default: false },
];
