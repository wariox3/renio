import { FilterField } from "src/app/core/interfaces/filtro.interface";

export const LIQUIDACION_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'contrato__contacto__numero_identificacion', displayName: '[Contacto] identificación', type: 'string'},
];
