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
      valor: 'exact',
      texto: 'IGUAL',
      defecto: true,
    },
    {
      valor: 'gt',
      texto: 'MAYORQUE',
    },
    {
      valor: 'gte',
      texto: 'MAYORIGUALQUE',
    },
    {
      valor: 'lt',
      texto: 'MENORQUE',
    },
    {
      valor: 'lte',
      texto: 'MENORIGUALQUE',
    },
    {
      valor: 'range',
      texto: 'RANGE',
    },
  ],
  FloatField: [
    {
      valor: 'exact',
      texto: 'IGUAL',
      defecto: true,
    },
    {
      valor: 'gt',
      texto: 'MAYORQUE',
    },
    {
      valor: 'gte',
      texto: 'MAYORIGUALQUE',
    },
    {
      valor: 'lt',
      texto: 'MENORQUE',
    },
    {
      valor: 'lte',
      texto: 'MENORIGUALQUE',
    },
    {
      valor: 'range',
      texto: 'RANGE',
    },
  ],
  CharField: [
    {
      valor: 'exact',
      texto: 'IGUAL',
    },
    {
      valor: 'icontains',
      texto: 'CONTIENE',
      defecto: true,
    },
    {
      valor: 'startswith',
      texto: 'EMPIEZAPOR',
    }
  ],
  DateField: [
    {
      valor: 'exact',
      texto: 'IGUAL',
      defecto: true,
    },
    {
      valor: 'gt',
      texto: 'MAYORQUE',
    },
    {
      valor: 'gte',
      texto: 'MAYORIGUALQUE',
    },
    {
      valor: 'lt',
      texto: 'MENORQUE',
    },
    {
      valor: 'lte',
      texto: 'MENORIGUALQUE',
    },
    {
      valor: 'range',
      texto: 'RANGE',
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
      valor: 'exact',
      texto: 'IGUAL',
      defecto: true,
    },
  ]
};

export const criteriosFiltroReducer = createReducer(initialState);
