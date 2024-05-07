import { createReducer } from '@ngrx/store';

export type CriteriosFiltro = {
  [key: string]: {
    valor: string;
    texto: string;
    defecto?: boolean;
  }[];
};

export const initialState: CriteriosFiltro = {
  IntegerField: [
    {
      valor: '',
      texto: 'IGUAL',
      defecto: true,
    },
    {
      valor: '__gt',
      texto: 'MAYORQUE',
    },
    {
      valor: '__gte',
      texto: 'MAYORIGUALQUE',
    },
    {
      valor: '__lt',
      texto: 'MENORQUE',
    },
    {
      valor: '__lte',
      texto: 'MENORIGUALQUE',
    },
  ],
  FloatField: [
    {
      valor: '',
      texto: 'IGUAL',
      defecto: true,
    },
    {
      valor: '__gt',
      texto: 'MAYORQUE',
    },
    {
      valor: '__gte',
      texto: 'MAYORIGUALQUE',
    },
    {
      valor: '__lt',
      texto: 'MENORQUE',
    },
    {
      valor: '__lte',
      texto: 'MENORIGUALQUE',
    },
  ],
  CharField: [
    {
      valor: '',
      texto: 'IGUAL',
    },
    {
      valor: '__icontains',
      texto: 'CONTIENE',
      defecto: true,
    },
  ],
  DateField: [
    {
      valor: '',
      texto: 'IGUAL',
      defecto: true,
    },
    {
      valor: '__gt',
      texto: 'MAYORQUE',
    },
    {
      valor: '__gte',
      texto: 'MAYORIGUALQUE',
    },
    {
      valor: '__lt',
      texto: 'MENORQUE',
    },
    {
      valor: '__lte',
      texto: 'MENORIGUALQUE',
    },
  ],
  Booleano: [
    {
      valor: '__is',
      texto: 'ES',
    },
    {
      valor: '__no_is',
      texto: 'NO',
    },
  ],
};

export const criteriosFiltroReducer = createReducer(initialState);
