import { createReducer } from '@ngrx/store';

export type CriteriosFiltro = {
  [key: string]: {
    valor: string|number|boolean;
    texto: string;
    defecto?: boolean;
  }[];
};

export const initialState: CriteriosFiltro = {
  IntegerField: [
    {
      valor: '__exact',
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
    {
      valor: 'range',
      texto: 'range',
    },
  ],
  FloatField: [
    {
      valor: '__exact',
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
    {
      valor: 'range',
      texto: 'range',
    },
  ],
  CharField: [
    {
      valor: '__exact',
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
      valor: 'exact',
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
    {
      valor: 'range',
      texto: 'range',
    },
  ],
  Booleano: [
    {
      valor: true,
      texto: 'ES',
    },
    {
      valor: false,
      texto: 'NO',
    },
  ],
  Fk: [
    {
      valor: 'igual',
      texto: 'IGUAL',
      defecto: true,
    },
  ]
};

export const criteriosFiltroReducer = createReducer(initialState);
