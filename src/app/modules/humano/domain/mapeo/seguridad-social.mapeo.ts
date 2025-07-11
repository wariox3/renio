import { FilterField } from "src/app/core/interfaces/filtro.interface";

export const SEGURIDAD_SOCIAL_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'Id', type: 'number' },
    { name: 'mes', displayName: 'Mes', type: 'number' },
    { name: 'anio', displayName: 'Año', type: 'number' },
];

export const APORTE_DETALLE_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'aporte_contrato__contrato__contacto__nombre_corto', displayName: 'Nombre', type: 'string' },
    { name: 'aporte_contrato_id', displayName: 'Contrato', type: 'number' },
];

export const APORTE_CONTRATO_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'contrato__contacto__nombre_corto', displayName: 'Nombre corto', type: 'string' },
    { name: 'contrato__contacto_id', displayName: 'Contrato', type: 'number' },
];