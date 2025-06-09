import { Operator } from '../../interfaces/filtro.interface';

export const OPERADORES_FILTRO: Operator[] = [
  {
    symbol: '=',
    name: 'Igual',
    types: ['string', 'number', 'date', 'boolean'],
    default: true,
  },
  {
    symbol: '!=',
    name: 'Distinto',
    types: ['string', 'number', 'date', 'boolean'],
    default: false,
  },
  {
    symbol: '>',
    name: 'Mayor que',
    types: ['number', 'date'],
    default: false,
  },
  {
    symbol: '<',
    name: 'Menor que',
    types: ['number', 'date'],
    default: false,
  },
  {
    symbol: '>=',
    name: 'Mayor o igual',
    types: ['number', 'date'],
    default: false,
  },
  {
    symbol: '<=',
    name: 'Menor o igual',
    types: ['number', 'date'],
    default: false,
  },
  { symbol: 'contains', name: 'Contiene', types: ['string'], default: false },
  {
    symbol: 'startsWith',
    name: 'Empieza con',
    types: ['string'],
    default: false,
  },
  {
    symbol: 'endsWith',
    name: 'Termina con',
    types: ['string'],
    default: false,
  },
];
