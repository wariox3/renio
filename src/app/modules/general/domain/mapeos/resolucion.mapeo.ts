import { FilterField } from "src/app/core/interfaces/filtro.interface";

export const RESOLUCION_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'numero', displayName: 'Número', type: 'string' },
];