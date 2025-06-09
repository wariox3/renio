// filter.model.ts
export interface FilterCondition {
  field: string;
  operator: string;
  value: any;
}

export interface FilterField {
  name: string;
  displayName: string;
  type: 'string' | 'number' | 'date' | 'boolean';
}

export interface Operator {
  symbol: string;
  name: string;
  types: FilterField['type'][];
  default: boolean;
}