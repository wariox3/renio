import {
  FilterCondition,
  FilterField,
} from 'src/app/core/interfaces/filtro.interface';

export const CONTACTO_FILTERS: FilterField[] = [
  { name: 'id', displayName: 'ID', type: 'number' },
  { name: 'nombre_corto', displayName: 'Nombre', type: 'string' },
  {
    name: 'numero_identificacion',
    displayName: 'Número de identificación',
    type: 'string',
  },
  { name: 'cliente', displayName: 'Cliente', type: 'boolean' },
  { name: 'proveedor', displayName: 'Proveedor', type: 'boolean' },
  { name: 'empleado', displayName: 'Empleado', type: 'boolean' },
];

export const CONTACTO_LISTA_BUSCAR_AVANZADO: FilterField[] = [
  { name: 'id', displayName: 'ID', type: 'number' },
  {
    name: 'numero_identificacion',
    displayName: 'Número de identificación',
    type: 'string',
  },
  { name: 'nombre_corto', displayName: 'Nombre', type: 'string' },
];

export const CONTACTO_FILTRO_PERMANENTE_CLIENTE: Record<string, any> = {
  cliente: 'True',
};
