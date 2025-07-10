import { FilterField } from "src/app/core/interfaces/filtro.interface";

export const MOVIMIENTO_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'numero', displayName: 'Número', type: 'string' },
    { name: 'fecha', displayName: 'Fecha', type: 'date' },
    { name: 'cuenta__codigo', displayName: 'Cuenta codigo', type: 'string' },
];