import { FilterField } from "src/app/core/interfaces/filtro.interface";

export const ADICIONAL_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'nombre', displayName: 'Nombre', type: 'string' },
    { name: 'codigo', displayName: 'Código', type: 'string' },
    { name: 'estado_inactivo', displayName: 'Inactivo', type: 'boolean' },
];

export const ADICIONAL_DETALLE_FILTERS: FilterField[] = [
  { name: 'id', displayName: 'ID', type: 'number' },
  { name: 'aporte_contrato__contrato__contacto__nombre_corto', displayName: 'Nombre corto', type: 'string' },
  { name: 'aporte_contrato__contrato__contacto_id', displayName: 'Contrato', type: 'number' },
];
