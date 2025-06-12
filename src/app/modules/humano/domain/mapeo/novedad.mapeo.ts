import { FilterField } from "src/app/core/interfaces/filtro.interface";

export const NOVEDAD_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'novedad_tipo__nombre', displayName: '[Novedad] Tipo', type: 'string' },
    { name: 'contrato__contacto__numero_identificacion', displayName: '[Contrato] Identificación', type: 'string' },
    { name: 'contrato__contacto__nombre_corto', displayName: '[Contrato] Nombre', type: 'string' },
    { name: 'contrato__id', displayName: '[Contrato] ID', type: 'number' },
    { name: 'fecha_desde', displayName: 'Fecha desde', type: 'date' },
    { name: 'fecha_hasta', displayName: 'Fecha hasta', type: 'date' },
];