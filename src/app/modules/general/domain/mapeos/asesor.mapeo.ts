import { FilterField } from "src/app/core/interfaces/filtro.interface";

export const ASESOR_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'nombre_corto', displayName: 'Nombre', type: 'string' },
];